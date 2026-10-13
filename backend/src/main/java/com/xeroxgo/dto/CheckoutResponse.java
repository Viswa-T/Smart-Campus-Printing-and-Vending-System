package com.xeroxgo.dto;

import java.math.BigDecimal;

public class CheckoutResponse {
    private Long paymentId;
    private Long orderId;
    private String publicOrderReference;
    private BigDecimal amount;
    private String currency;
    private String paymentStatus;
    private String paymentProvider;
    private String providerReference;
    private String accessCode; // Available when payment is marked successful

    public CheckoutResponse() {}

    public Long getPaymentId() { return paymentId; }
    public void setPaymentId(Long paymentId) { this.paymentId = paymentId; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public String getPublicOrderReference() { return publicOrderReference; }
    public void setPublicOrderReference(String publicOrderReference) { this.publicOrderReference = publicOrderReference; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public String getPaymentProvider() { return paymentProvider; }
    public void setPaymentProvider(String paymentProvider) { this.paymentProvider = paymentProvider; }

    public String getProviderReference() { return providerReference; }
    public void setProviderReference(String providerReference) { this.providerReference = providerReference; }

    public String getAccessCode() { return accessCode; }
    public void setAccessCode(String accessCode) { this.accessCode = accessCode; }
}
