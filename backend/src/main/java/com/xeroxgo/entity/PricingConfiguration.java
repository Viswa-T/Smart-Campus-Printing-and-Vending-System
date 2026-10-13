package com.xeroxgo.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "pricing_configurations")
public class PricingConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "config_version", nullable = false, unique = true)
    private String configVersion;

    @Column(name = "bw_price_per_page", nullable = false, precision = 10, scale = 2)
    private BigDecimal bwPricePerPage = new BigDecimal("1.00");

    @Column(name = "color_price_per_page", nullable = false, precision = 10, scale = 2)
    private BigDecimal colorPricePerPage = new BigDecimal("5.00");

    @Column(name = "double_side_discount_percent", nullable = false, precision = 5, scale = 2)
    private BigDecimal doubleSideDiscountPercent = new BigDecimal("30.00");

    @Column(name = "currency", nullable = false)
    private String currency = "INR";

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "effective_from", nullable = false)
    private LocalDateTime effectiveFrom = LocalDateTime.now();

    public PricingConfiguration() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getConfigVersion() { return configVersion; }
    public void setConfigVersion(String configVersion) { this.configVersion = configVersion; }

    public BigDecimal getBwPricePerPage() { return bwPricePerPage; }
    public void setBwPricePerPage(BigDecimal bwPricePerPage) { this.bwPricePerPage = bwPricePerPage; }

    public BigDecimal getColorPricePerPage() { return colorPricePerPage; }
    public void setColorPricePerPage(BigDecimal colorPricePerPage) { this.colorPricePerPage = colorPricePerPage; }

    public BigDecimal getDoubleSideDiscountPercent() { return doubleSideDiscountPercent; }
    public void setDoubleSideDiscountPercent(BigDecimal doubleSideDiscountPercent) { this.doubleSideDiscountPercent = doubleSideDiscountPercent; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public LocalDateTime getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDateTime effectiveFrom) { this.effectiveFrom = effectiveFrom; }
}
