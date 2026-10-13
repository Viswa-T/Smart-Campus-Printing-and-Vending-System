package com.xeroxgo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "public_order_reference", nullable = false, unique = true)
    private String publicOrderReference;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    @Column(name = "machine_id", nullable = false)
    private Long machineId;

    @Column(name = "order_status", nullable = false)
    private String orderStatus = "PENDING_PAYMENT";

    @Column(name = "total_pages", nullable = false)
    private int totalPages;

    @Column(name = "copies", nullable = false)
    private int copies = 1;

    @Column(name = "color_mode", nullable = false)
    private String colorMode = "BW"; // BW or COLOR

    @Column(name = "print_sides", nullable = false)
    private String printSides = "SINGLE"; // SINGLE or DOUBLE

    @Column(name = "base_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal baseAmount;

    @Column(name = "discount_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal discountAmount = BigDecimal.ZERO;

    @Column(name = "final_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal finalAmount;

    @Column(name = "currency", nullable = false)
    private String currency = "INR";

    @Column(name = "pricing_version", nullable = false)
    private String pricingVersion = "v1.0";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "collected_at")
    private LocalDateTime collectedAt;

    public Order() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPublicOrderReference() { return publicOrderReference; }
    public void setPublicOrderReference(String publicOrderReference) { this.publicOrderReference = publicOrderReference; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

    public Long getMachineId() { return machineId; }
    public void setMachineId(Long machineId) { this.machineId = machineId; }

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

    public String getPricingVersion() { return pricingVersion; }
    public void setPricingVersion(String pricingVersion) { this.pricingVersion = pricingVersion; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getPaidAt() { return paidAt; }
    public void setPaidAt(LocalDateTime paidAt) { this.paidAt = paidAt; }

    public LocalDateTime getCollectedAt() { return collectedAt; }
    public void setCollectedAt(LocalDateTime collectedAt) { this.collectedAt = collectedAt; }
}
