package com.xeroxgo.dto;

import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class CheckoutRequest {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    private String paymentMethod = "UPI"; // UPI, CARD, NETBANKING

    public CheckoutRequest() {}

    public CheckoutRequest(Long orderId, String paymentMethod) {
        this.orderId = orderId;
        this.paymentMethod = paymentMethod;
    }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
