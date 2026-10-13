package com.xeroxgo.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {
    private Long id;
    private String publicOrderReference;
    private Long collegeId;
    private String collegeName;
    private Long machineId;
    private String machineName;
    private String machineLocation;
    private String orderStatus;
    private int totalPages;
    private int copies;
    private String colorMode;
    private String printSides;
    private BigDecimal baseAmount;
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
    private String currency;
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private LocalDateTime collectedAt;
    private String accessCode;
    private List<DocumentDto> documents;

    public OrderDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPublicOrderReference() { return publicOrderReference; }
    public void setPublicOrderReference(String publicOrderReference) { this.publicOrderReference = publicOrderReference; }

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public Long getMachineId() { return machineId; }
    public void setMachineId(Long machineId) { this.machineId = machineId; }

    public String getMachineName() { return machineName; }
    public void setMachineName(String machineName) { this.machineName = machineName; }

    public String getMachineLocation() { return machineLocation; }
    public void setMachineLocation(String machineLocation) { this.machineLocation = machineLocation; }

    public String getOrderStatus() { return orderStatus; }
    public void setOrderStatus(String orderStatus) { this.orderStatus = orderStatus; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public int getCopies() { return copies; }
    public void setCopies(int copies) { this.copies = copies; }

    public String getColorMode() { return colorMode; }
    public void setColorMode(String colorMode) { this.colorMode = colorMode; }

    public String getPrintSides() { return printSides; }
    public void setPrintSides(String printSides) { this.printSides = printSides; }

    public BigDecimal getBaseAmount() { return baseAmount; }
    public void setBaseAmount(BigDecimal baseAmount) { this.baseAmount = baseAmount; }

    public BigDecimal getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(BigDecimal discountAmount) { this.discountAmount = discountAmount; }

    public BigDecimal getFinalAmount() { return finalAmount; }
    public void setFinalAmount(BigDecimal finalAmount) { this.finalAmount = finalAmount; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public LocalDateTime getCollectedAt() { return collectedAt; }
    public void setCollectedAt(LocalDateTime collectedAt) { this.collectedAt = collectedAt; }

    public String getAccessCode() { return accessCode; }
    public void setAccessCode(String accessCode) { this.accessCode = accessCode; }

    public List<DocumentDto> getDocuments() { return documents; }
    public void setDocuments(List<DocumentDto> documents) { this.documents = documents; }
}
