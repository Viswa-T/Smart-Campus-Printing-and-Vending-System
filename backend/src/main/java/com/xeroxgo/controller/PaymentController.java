package com.xeroxgo.controller;

import com.xeroxgo.dto.ApiResponse;
import com.xeroxgo.dto.CheckoutRequest;
import com.xeroxgo.dto.CheckoutResponse;
import com.xeroxgo.dto.PaymentWebhookRequest;
import com.xeroxgo.entity.User;
import com.xeroxgo.service.AuthService;
import com.xeroxgo.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final AuthService authService;

    public PaymentController(PaymentService paymentService, AuthService authService) {
        this.paymentService = paymentService;
        this.authService = authService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<CheckoutResponse>> checkout(@Valid @RequestBody CheckoutRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        CheckoutResponse response = paymentService.processCheckout(request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Payment completed successfully", response));
    }

    @PostMapping("/webhook/{provider}")
    public ResponseEntity<ApiResponse<Void>> handleWebhook(
            @PathVariable String provider,
            @RequestBody PaymentWebhookRequest request) {
        request.setProvider(provider);
        paymentService.processWebhook(request);
        return ResponseEntity.ok(ApiResponse.success("Webhook processed", null));
    }
}
