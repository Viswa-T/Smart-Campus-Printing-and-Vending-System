package com.xeroxgo.dto;

import java.math.BigDecimal;

public class PricingQuoteResponse {
    private int documentCount;
    private int totalPages;
    private int copies;
    private int totalChargeablePages;
    private String colorMode;
    private String printSides;
    private BigDecimal ratePerPage;
    private BigDecimal baseAmount;
    private BigDecimal discountPercentage;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String currency;
    private String pricingVersion;

    public PricingQuoteResponse() {}

    public int getDocumentCount() { return documentCount; }
    public void setDocumentCount(int documentCount) { this.documentCount = documentCount; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public int getCopies() { return copies; }
    public void setCopies(int copies) { this.copies = copies; }

    public int getTotalChargeablePages() { return totalChargeablePages; }
    public void setTotalChargeablePages(int totalChargeablePages) { this.totalChargeablePages = totalChargeablePages; }

    public String getColorMode() { return colorMode; }
    public void setColorMode(String colorMode) { this.colorMode = colorMode; }

    public String getPrintSides() { return printSides; }
    public void setPrintSides(String printSides) { this.printSides = printSides; }

    public BigDecimal getRatePerPage() { return ratePerPage; }
    public void setRatePerPage(BigDecimal ratePerPage) { this.ratePerPage = ratePerPage; }

    public BigDecimal getBaseAmount() { return baseAmount; }
    public void setBaseAmount(BigDecimal baseAmount) { this.baseAmount = baseAmount; }

    public BigDecimal getDiscountPercentage() { return discountPercentage; }
    public void setDiscountPercentage(BigDecimal discountPercentage) { this.discountPercentage = discountPercentage; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getFinalAmount() { return finalAmount; }
    public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getPricingVersion() { return pricingVersion; }
    public void setPricingVersion(String pricingVersion) { this.pricingVersion = pricingVersion; }
}
