package com.xeroxgo.service;

import com.xeroxgo.dto.CollectionCompleteRequest;
import com.xeroxgo.dto.CollectionValidateRequest;
import com.xeroxgo.dto.CollectionValidateResponse;
import com.xeroxgo.entity.*;
import com.xeroxgo.exception.BadRequestException;
import com.xeroxgo.exception.ResourceNotFoundException;
import com.xeroxgo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class CollectionService {

    private final AccessCodeRepository accessCodeRepository;
    private final OrderRepository orderRepository;
    private final MachineRepository machineRepository;
    private final OrderDocumentRepository orderDocumentRepository;
    private final DocumentRepository documentRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final PaymentService paymentService;

    public CollectionService(AccessCodeRepository accessCodeRepository,
                             OrderRepository orderRepository,
                             MachineRepository machineRepository,
                             OrderDocumentRepository orderDocumentRepository,
                             DocumentRepository documentRepository,
                             OrderStatusHistoryRepository statusHistoryRepository,
                             PaymentService paymentService) {
        this.accessCodeRepository = accessCodeRepository;
        this.orderRepository = orderRepository;
        this.machineRepository = machineRepository;
        this.orderDocumentRepository = orderDocumentRepository;
        this.documentRepository = documentRepository;
        this.statusHistoryRepository = statusHistoryRepository;
        this.paymentService = paymentService;
    }

    public CollectionValidateResponse validateCollectionCode(CollectionValidateRequest request) {
        String code = request.getCode().trim().toUpperCase();
        String codeHash = paymentService.hashCollectionCode(code);

        AccessCode accessCode = accessCodeRepository.findByCode(code)
                .or(() -> accessCodeRepository.findByCodeHash(codeHash))
                .orElse(null);

        if (accessCode == null) {
            CollectionValidateResponse res = new CollectionValidateResponse();
            res.setValid(false);
            res.setMessage("Invalid access code");
            return res;
        }

        if (accessCode.isRevoked()) {
            CollectionValidateResponse res = new CollectionValidateResponse();
            res.setValid(false);
            res.setMessage("This access code has been revoked");
            return res;
        }

        if (accessCode.getUsedAt() != null) {
            CollectionValidateResponse res = new CollectionValidateResponse();
            res.setValid(false);
            res.setMessage("This access code has already been collected");
            return res;
        }

        if (accessCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            CollectionValidateResponse res = new CollectionValidateResponse();
            res.setValid(false);
            res.setMessage("This access code has expired (validity is 24 hours)");
            return res;
        }

        Order order = orderRepository.findById(accessCode.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Associated order not found"));

        Machine machine = machineRepository.findById(order.getMachineId()).orElse(null);

        if (request.getMachineCode() != null && machine != null) {
            if (!machine.getMachineCode().equalsIgnoreCase(request.getMachineCode().trim())) {
                CollectionValidateResponse res = new CollectionValidateResponse();
                res.setValid(false);
                res.setMessage("This print job is designated for machine " + machine.getMachineName() + " (" + machine.getMachineCode() + ")");
                return res;
            }
        }

        List<OrderDocument> orderDocs = orderDocumentRepository.findByOrderId(order.getId());
        List<String> docNames = new ArrayList<>();
        for (OrderDocument od : orderDocs) {
            documentRepository.findById(od.getDocumentId()).ifPresent(d -> docNames.add(d.getOriginalFilename()));
        }

        CollectionValidateResponse res = new CollectionValidateResponse();
        res.setValid(true);
        res.setMessage("Access code verified successfully. Ready to print.");
        res.setOrderReference(order.getPublicOrderReference());
        res.setMachineName(machine != null ? machine.getMachineName() : "Campus Kiosk");
        res.setTotalPages(order.getTotalPages());
        res.setCopies(order.getCopies());
        res.setColorMode(order.getColorMode());
        res.setPrintSides(order.getPrintSides());
        res.setDocumentNames(docNames);
        return res;
    }

    @Transactional
    public void completeCollection(CollectionCompleteRequest request) {
        String code = request.getCode().trim().toUpperCase();
        String codeHash = paymentService.hashCollectionCode(code);

        AccessCode accessCode = accessCodeRepository.findByCode(code)
                .or(() -> accessCodeRepository.findByCodeHash(codeHash))
                .orElseThrow(() -> new BadRequestException("Invalid collection code"));

        if (accessCode.getUsedAt() != null) {
            throw new BadRequestException("Order has already been collected");
        }

        if (accessCode.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Collection code has expired");
        }

        accessCode.setUsedAt(LocalDateTime.now());
        accessCodeRepository.save(accessCode);

        Order order = orderRepository.findById(accessCode.getOrderId())
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        String oldStatus = order.getOrderStatus();
        order.setOrderStatus("COLLECTED");
        order.setCollectedAt(LocalDateTime.now());
        orderRepository.save(order);

        statusHistoryRepository.save(new OrderStatusHistory(
                order.getId(), oldStatus, "COLLECTED", "MACHINE", null, "Prints collected at kiosk"
        ));
    }
}
