package com.xeroxgo.service;

import com.xeroxgo.dto.CheckoutRequest;
import com.xeroxgo.dto.CheckoutResponse;
import com.xeroxgo.dto.PaymentWebhookRequest;
import com.xeroxgo.entity.AccessCode;
import com.xeroxgo.entity.Order;
import com.xeroxgo.entity.OrderStatusHistory;
import com.xeroxgo.entity.Payment;
import com.xeroxgo.exception.BadRequestException;
import com.xeroxgo.exception.ResourceNotFoundException;
import com.xeroxgo.exception.UnauthorizedException;
import com.xeroxgo.repository.AccessCodeRepository;
import com.xeroxgo.repository.OrderRepository;
import com.xeroxgo.repository.OrderStatusHistoryRepository;
import com.xeroxgo.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final AccessCodeRepository accessCodeRepository;
    private final OrderStatusHistoryRepository statusHistoryRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${xeroxgo.payment.mode:DEVELOPMENT}")
    private String paymentMode;

    private static final String CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Removed ambiguous chars I, O, 0, 1

    public PaymentService(PaymentRepository paymentRepository,
                          OrderRepository orderRepository,
                          AccessCodeRepository accessCodeRepository,
                          OrderStatusHistoryRepository statusHistoryRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
        this.accessCodeRepository = accessCodeRepository;
        this.statusHistoryRepository = statusHistoryRepository;
    }

    @Transactional
    public CheckoutResponse processCheckout(CheckoutRequest request, Long userId) {
        Order order = orderRepository.findByIdForUpdate(request.getOrderId())
            .orElseThrow(() -> new ResourceNotFoundException(
                    "Order not found with id: " + request.getOrderId()
            ));

        if (!order.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to pay for this order");
        }

        if (!"PENDING_PAYMENT".equalsIgnoreCase(order.getOrderStatus())) {
            throw new BadRequestException("Order is not in pending payment state (current status: " + order.getOrderStatus() + ")");
        }

        String providerRef = "PAY_" + System.currentTimeMillis() + "_" + (1000 + secureRandom.nextInt(9000));
        String idempotencyKey = "IDEM_" + order.getId() + "_" + order.getPublicOrderReference();

        Payment payment = paymentRepository.findByIdempotencyReference(idempotencyKey)
                .orElseGet(() -> {
                    Payment p = new Payment();
                    p.setOrderId(order.getId());
                    p.setPaymentProvider("DEVELOPMENT".equalsIgnoreCase(paymentMode) ? "MOCK_GATEWAY" : "RAZORPAY");
                    p.setProviderPaymentReference(providerRef);
                    p.setAmount(order.getFinalAmount());
                    p.setCurrency(order.getCurrency());
                    p.setPaymentStatus("PROCESSING");
                    p.setIdempotencyReference(idempotencyKey);
                    return paymentRepository.save(p);
                });

        // In Development/Test mode, complete payment transactionally and issue secure collection code
        payment.setPaymentStatus("SUCCESS");
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        String oldStatus = order.getOrderStatus();
        order.setOrderStatus("PAID");
        order.setPaidAt(LocalDateTime.now());
        orderRepository.save(order);

        // Generate 6-character collection code (valid 24h)
        String code = generateSecureCollectionCode();
        String codeHash = hashCollectionCode(code);

        AccessCode accessCode = accessCodeRepository.findByOrderId(order.getId())
                .orElseGet(() -> new AccessCode(
                        order.getId(),
                        code,
                        codeHash,
                        LocalDateTime.now().plusHours(24)
                ));
        accessCode.setCode(code);
        accessCode.setCodeHash(codeHash);
        accessCode.setExpiresAt(LocalDateTime.now().plusHours(24));
        accessCodeRepository.save(accessCode);

        // Record status transition
        statusHistoryRepository.save(new OrderStatusHistory(
                order.getId(), oldStatus, "PAID", "SYSTEM", userId, "Payment verified via " + request.getPaymentMethod()
        ));

        CheckoutResponse response = new CheckoutResponse();
        response.setPaymentId(payment.getId());
        response.setOrderId(order.getId());
        response.setPublicOrderReference(order.getPublicOrderReference());
        response.setAmount(order.getFinalAmount());
        response.setCurrency(order.getCurrency());
        response.setPaymentStatus("SUCCESS");
        response.setPaymentProvider(payment.getPaymentProvider());
        response.setProviderReference(payment.getProviderPaymentReference());
        response.setAccessCode(code);

        return response;
    }

    @Transactional
    public void processWebhook(PaymentWebhookRequest webhook) {

        Order order = orderRepository
                .findByPublicOrderReferenceForUpdate(webhook.getOrderReference())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Order not found with reference: "
                                + webhook.getOrderReference()
                ));

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseGet(() -> {
                    Payment p = new Payment();
                    p.setOrderId(order.getId());
                    p.setPaymentProvider(webhook.getProvider());
                    p.setProviderPaymentReference(webhook.getReference());
                    p.setAmount(
                            webhook.getAmount() != null
                                    ? webhook.getAmount()
                                    : order.getFinalAmount()
                    );
                    p.setCurrency(order.getCurrency());
                    return p;
                });

        if ("SUCCESS".equalsIgnoreCase(webhook.getStatus())) {

            payment.setPaymentStatus("SUCCESS");
            payment.setPaidAt(LocalDateTime.now());

            order.setOrderStatus("PAID");
            order.setPaidAt(LocalDateTime.now());

            // Reuse the existing access code if one already exists.
            AccessCode accessCode = accessCodeRepository
                    .findByOrderId(order.getId())
                    .orElse(null);

            if (accessCode == null) {
                String code = generateSecureCollectionCode();
                String codeHash = hashCollectionCode(code);

                accessCode = new AccessCode(
                        order.getId(),
                        code,
                        codeHash,
                        LocalDateTime.now().plusHours(24)
                );

                accessCodeRepository.save(accessCode);
            }

            statusHistoryRepository.save(new OrderStatusHistory(
                    order.getId(),
                    "PENDING_PAYMENT",
                    "PAID",
                    "SYSTEM",
                    null,
                    "Webhook confirmed payment"
            ));

        } else {

            payment.setPaymentStatus("FAILED");
            order.setOrderStatus("PAYMENT_FAILED");

            statusHistoryRepository.save(new OrderStatusHistory(
                    order.getId(),
                    "PENDING_PAYMENT",
                    "PAYMENT_FAILED",
                    "SYSTEM",
                    null,
                    "Webhook payment failed"
            ));
        }

        paymentRepository.save(payment);
        orderRepository.save(order);
    }

    public String generateSecureCollectionCode() {
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(CODE_CHARS.charAt(secureRandom.nextInt(CODE_CHARS.length())));
        }
        return sb.toString();
    }

    public String hashCollectionCode(String code) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(code.toUpperCase().getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }
}
