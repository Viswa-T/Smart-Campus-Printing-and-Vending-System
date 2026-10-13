package com.xeroxgo.service;

import com.xeroxgo.dto.CreateOrderRequest;
import com.xeroxgo.dto.DocumentDto;
import com.xeroxgo.dto.OrderDto;
import com.xeroxgo.dto.PagedResponse;
import com.xeroxgo.dto.PricingQuoteResponse;
import com.xeroxgo.entity.*;
import com.xeroxgo.exception.BadRequestException;
import com.xeroxgo.exception.ResourceNotFoundException;
import com.xeroxgo.exception.UnauthorizedException;
import com.xeroxgo.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDocumentRepository orderDocumentRepository;
    private final DocumentRepository documentRepository;
    private final CollegeRepository collegeRepository;
    private final MachineRepository machineRepository;
    private final AccessCodeRepository accessCodeRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final PricingService pricingService;
    private final DocumentService documentService;

    public OrderService(OrderRepository orderRepository,
                        OrderDocumentRepository orderDocumentRepository,
                        DocumentRepository documentRepository,
                        CollegeRepository collegeRepository,
                        MachineRepository machineRepository,
                        AccessCodeRepository accessCodeRepository,
                        OrderStatusHistoryRepository statusHistoryRepository,
                        PricingService pricingService,
                        DocumentService documentService) {
        this.orderRepository = orderRepository;
        this.orderDocumentRepository = orderDocumentRepository;
        this.documentRepository = documentRepository;
        this.collegeRepository = collegeRepository;
        this.machineRepository = machineRepository;
        this.accessCodeRepository = accessCodeRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.pricingService = pricingService;
        this.documentService = documentService;
    }

    @Transactional
    public OrderDto createOrder(CreateOrderRequest request, Long userId) {
        College college = collegeRepository.findById(request.getCollegeId())
                .orElseThrow(() -> new BadRequestException("Selected college not found"));

        Machine machine = machineRepository.findById(request.getMachineId())
                .orElseThrow(() -> new BadRequestException("Selected machine not found"));

        if (!machine.getCollegeId().equals(college.getId())) {
            throw new BadRequestException("Selected machine does not belong to the selected college");
        }

        if (!"ACTIVE".equalsIgnoreCase(machine.getOperationalStatus())) {
            throw new BadRequestException("Selected printing machine is currently unavailable (" + machine.getOperationalStatus() + ")");
        }

        List<Document> documents = documentRepository.findByIdInAndUserId(request.getDocumentIds(), userId);
        if (documents.size() != request.getDocumentIds().size()) {
            throw new BadRequestException("One or more selected documents do not exist or belong to another user");
        }

        int totalPages = documents.stream().mapToInt(Document::getPageCount).sum();
        int copies = Math.min(10, Math.max(1, request.getCopies()));
        String colorMode = "COLOR".equalsIgnoreCase(request.getColorMode()) ? "COLOR" : "BW";
        String printSides = "DOUBLE".equalsIgnoreCase(request.getPrintSides()) ? "DOUBLE" : "SINGLE";

        // Authoritatively recalculate the price on backend
        PricingQuoteResponse quote = pricingService.calculatePrice(
                documents.size(), totalPages, copies, colorMode, printSides
        );

        String publicRef = "ORD" + System.currentTimeMillis() + (100 + new Random().nextInt(900));

        Order order = new Order();
        order.setPublicOrderReference(publicRef);
        order.setUserId(userId);
        order.setCollegeId(college.getId());
        order.setMachineId(machine.getId());
        order.setOrderStatus("PENDING_PAYMENT");
        order.setTotalPages(totalPages);
        order.setCopies(copies);
        order.setColorMode(colorMode);
        order.setPrintSides(printSides);
        order.setBaseAmount(quote.getBaseAmount());
        order.setDiscountAmount(quote.getDiscountAmount());
        order.setFinalAmount(quote.getFinalAmount());
        order.setCurrency(quote.getCurrency());
        order.setPricingVersion(quote.getPricingVersion());

        order = orderRepository.save(order);

        // Associate documents
        for (Document doc : documents) {
            OrderDocument od = new OrderDocument(order.getId(), doc.getId(), doc.getPageCount(), copies);
            orderDocumentRepository.save(od);
        }

        // Record status transition
        statusHistoryRepository.save(new OrderStatusHistory(
                order.getId(), null, "PENDING_PAYMENT", "USER", userId, "Order created"
        ));

        return mapToDto(order);
    }

    public PagedResponse<OrderDto> getUserOrders(Long userId, String statusFilter, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(50, Math.max(1, size)));
        Page<Order> orderPage;

        if (statusFilter != null && !statusFilter.trim().isEmpty() && !"ALL".equalsIgnoreCase(statusFilter)) {
            orderPage = orderRepository.findByUserIdAndOrderStatusOrderByCreatedAtDesc(userId, statusFilter.trim().toUpperCase(), pageable);
        } else {
            orderPage = orderRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        }

        List<OrderDto> dtos = orderPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                dtos,
                orderPage.getNumber(),
                orderPage.getSize(),
                orderPage.getTotalElements(),
                orderPage.getTotalPages()
        );
    }

    public OrderDto getOrderDetails(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to view this order");
        }

        return mapToDto(order);
    }

    public OrderDto getOrderByReference(String reference, Long userId) {
        Order order = orderRepository.findByPublicOrderReference(reference)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with reference: " + reference));

        if (!order.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to view this order");
        }

        return mapToDto(order);
    }

    @Transactional
    public OrderDto cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + orderId));

        if (!order.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to cancel this order");
        }

        if (!"PENDING_PAYMENT".equalsIgnoreCase(order.getOrderStatus())) {
            throw new BadRequestException("Only pending payment orders can be cancelled directly");
        }

        String oldStatus = order.getOrderStatus();
        order.setOrderStatus("CANCELLED");
        order = orderRepository.save(order);

        statusHistoryRepository.save(new OrderStatusHistory(
                order.getId(), oldStatus, "CANCELLED", "USER", userId, "Order cancelled by user"
        ));

        return mapToDto(order);
    }

    public OrderDto mapToDto(Order order) {
        College college = collegeRepository.findById(order.getCollegeId()).orElse(null);
        Machine machine = machineRepository.findById(order.getMachineId()).orElse(null);
        AccessCode accessCode = accessCodeRepository.findByOrderId(order.getId()).orElse(null);

        List<OrderDocument> orderDocs = orderDocumentRepository.findByOrderId(order.getId());
        List<DocumentDto> documentDtos = new ArrayList<>();
        for (OrderDocument od : orderDocs) {
            documentRepository.findById(od.getDocumentId()).ifPresent(d -> {
                documentDtos.add(documentService.mapToDto(d));
            });
        }

        OrderDto dto = new OrderDto();
        dto.setId(order.getId());
        dto.setPublicOrderReference(order.getPublicOrderReference());
        dto.setCollegeId(order.getCollegeId());
        dto.setCollegeName(college != null ? college.getCollegeName() : "Campus");
        dto.setMachineId(order.getMachineId());
        dto.setMachineName(machine != null ? machine.getMachineName() : "Vending Kiosk");
        dto.setMachineLocation(machine != null ? machine.getLocationDescription() : "");
        dto.setOrderStatus(order.getOrderStatus());
        dto.setTotalPages(order.getTotalPages());
        dto.setCopies(order.getCopies());
        dto.setColorMode(order.getColorMode());
        dto.setPrintSides(order.getPrintSides());
        dto.setBaseAmount(order.getBaseAmount());
        dto.setDiscountAmount(order.getDiscountAmount());
        dto.setFinalAmount(order.getFinalAmount());
        dto.setCurrency(order.getCurrency());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setPaidAt(order.getPaidAt());
        dto.setCollectedAt(order.getCollectedAt());
        dto.setAccessCode(accessCode != null ? accessCode.getCode() : null);
        dto.setDocuments(documentDtos);
        return dto;
    }
}
