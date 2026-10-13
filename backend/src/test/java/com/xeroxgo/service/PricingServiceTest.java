package com.xeroxgo.service;

import com.xeroxgo.dto.PricingQuoteResponse;
import com.xeroxgo.entity.PricingConfiguration;
import com.xeroxgo.repository.DocumentRepository;
import com.xeroxgo.repository.PricingConfigurationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PricingServiceTest {

    @Mock
    private PricingConfigurationRepository pricingConfigRepository;

    @Mock
    private DocumentRepository documentRepository;

    @InjectMocks
    private PricingService pricingService;

    @BeforeEach
    void setUp() {
        PricingConfiguration config = new PricingConfiguration();
        config.setConfigVersion("v1.0");
        config.setBwPricePerPage(new BigDecimal("1.00"));
        config.setColorPricePerPage(new BigDecimal("5.00"));
        config.setDoubleSideDiscountPercent(new BigDecimal("30.00"));
        config.setCurrency("INR");
        config.setActive(true);

        when(pricingConfigRepository.findFirstByIsActiveTrueOrderByEffectiveFromDesc())
                .thenReturn(Optional.of(config));
    }

    @Test
    @DisplayName("10-page Black & White single-sided with 1 copy should be exactly ₹10.00")
    void testBlackAndWhiteSingleSided() {
        PricingQuoteResponse quote = pricingService.calculatePrice(1, 10, 1, "BW", "SINGLE");

        assertEquals(new BigDecimal("10.00"), quote.getBaseAmount());
        assertEquals(new BigDecimal("0.00"), quote.getDiscountAmount());
        assertEquals(new BigDecimal("10.00"), quote.getFinalAmount());
    }

    @Test
    @DisplayName("10-page Color single-sided with 1 copy should be exactly ₹50.00")
    void testColorSingleSided() {
        PricingQuoteResponse quote = pricingService.calculatePrice(1, 10, 1, "COLOR", "SINGLE");

        assertEquals(new BigDecimal("50.00"), quote.getBaseAmount());
        assertEquals(new BigDecimal("0.00"), quote.getDiscountAmount());
        assertEquals(new BigDecimal("50.00"), quote.getFinalAmount());
    }

    @Test
    @DisplayName("10-page Black & White double-sided with 1 copy should have 30% discount (₹3.00) and final ₹7.00")
    void testBlackAndWhiteDoubleSidedDiscount() {
        PricingQuoteResponse quote = pricingService.calculatePrice(1, 10, 1, "BW", "DOUBLE");

        assertEquals(new BigDecimal("10.00"), quote.getBaseAmount());
        assertEquals(new BigDecimal("3.00"), quote.getDiscountAmount());
        assertEquals(new BigDecimal("7.00"), quote.getFinalAmount());
    }

    @Test
    @DisplayName("10-page Color double-sided with 1 copy should have 30% discount (₹15.00) and final ₹35.00")
    void testColorDoubleSidedDiscount() {
        PricingQuoteResponse quote = pricingService.calculatePrice(1, 10, 1, "COLOR", "DOUBLE");

        assertEquals(new BigDecimal("50.00"), quote.getBaseAmount());
        assertEquals(new BigDecimal("15.00"), quote.getDiscountAmount());
        assertEquals(new BigDecimal("35.00"), quote.getFinalAmount());
    }

    @Test
    @DisplayName("Reference UI Example: 37 pages (12 + 25) B&W single-sided = ₹37.00")
    void testReferenceUiCollageExample() {
        PricingQuoteResponse quote = pricingService.calculatePrice(2, 37, 1, "BW", "SINGLE");

        assertEquals(37, quote.getTotalPages());
        assertEquals(37, quote.getTotalChargeablePages());
        assertEquals(new BigDecimal("37.00"), quote.getBaseAmount());
        assertEquals(new BigDecimal("0.00"), quote.getDiscountAmount());
        assertEquals(new BigDecimal("37.00"), quote.getFinalAmount());
    }

    @Test
    @DisplayName("Multiple copies calculation: 10 pages B&W double-sided with 3 copies = base ₹30.00, discount ₹9.00, final ₹21.00")
    void testMultipleCopiesDoubleSided() {
        PricingQuoteResponse quote = pricingService.calculatePrice(1, 10, 3, "BW", "DOUBLE");

        assertEquals(30, quote.getTotalChargeablePages());
        assertEquals(new BigDecimal("30.00"), quote.getBaseAmount());
        assertEquals(new BigDecimal("9.00"), quote.getDiscountAmount());
        assertEquals(new BigDecimal("21.00"), quote.getFinalAmount());
    }
}
