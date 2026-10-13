package com.xeroxgo.dto;

import java.math.BigDecimal;

public class PaymentWebhookRequest {
    private String provider;
    private String reference;
    private String orderReference;
    private BigDecimal amount;
    private String status; // SUCCESS, FAILED
    private String signature;

    public PaymentWebhookRequest() {}

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }

    public String getOrderReference() { return orderReference; }
    public void setOrderReference(String orderReference) { this.orderReference = orderReference; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSignature() { return signature; }
    public void setSignature(String signature) { this.signature = signature; }
}
