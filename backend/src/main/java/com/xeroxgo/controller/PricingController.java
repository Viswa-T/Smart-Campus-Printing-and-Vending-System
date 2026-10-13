package com.xeroxgo.controller;

import com.xeroxgo.dto.ApiResponse;
import com.xeroxgo.dto.PricingQuoteRequest;
import com.xeroxgo.dto.PricingQuoteResponse;
import com.xeroxgo.entity.User;
import com.xeroxgo.service.AuthService;
import com.xeroxgo.service.PricingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/pricing")
public class PricingController {

    private final PricingService pricingService;
    private final AuthService authService;

    public PricingController(PricingService pricingService, AuthService authService) {
        this.pricingService = pricingService;
        this.authService = authService;
    }

    @PostMapping("/quote")
    public ResponseEntity<ApiResponse<PricingQuoteResponse>> getPricingQuote(
            @Valid @RequestBody PricingQuoteRequest request) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        PricingQuoteResponse quote = pricingService.calculateQuote(request, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(quote));
    }
}
