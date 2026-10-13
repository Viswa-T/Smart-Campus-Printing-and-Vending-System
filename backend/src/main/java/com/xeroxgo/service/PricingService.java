package com.xeroxgo.service;

import com.xeroxgo.dto.PricingQuoteRequest;
import com.xeroxgo.dto.PricingQuoteResponse;
import com.xeroxgo.entity.Document;
import com.xeroxgo.entity.PricingConfiguration;
import com.xeroxgo.exception.BadRequestException;
import com.xeroxgo.repository.DocumentRepository;
import com.xeroxgo.repository.PricingConfigurationRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class PricingService {

    private final PricingConfigurationRepository pricingConfigRepository;
    private final DocumentRepository documentRepository;

    @Value("${xeroxgo.pricing.bw-price-per-page:1.00}")
    private BigDecimal defaultBwPrice;

    @Value("${xeroxgo.pricing.color-price-per-page:5.00}")
    private BigDecimal defaultColorPrice;

    @Value("${xeroxgo.pricing.double-side-discount-percentage:30.00}")
    private BigDecimal defaultDoubleSideDiscount;

    public PricingService(PricingConfigurationRepository pricingConfigRepository,
                          DocumentRepository documentRepository) {
        this.pricingConfigRepository = pricingConfigRepository;
        this.documentRepository = documentRepository;
    }

    public PricingQuoteResponse calculateQuote(PricingQuoteRequest request, Long userId) {
        if (request.getDocumentIds() == null || request.getDocumentIds().isEmpty()) {
            throw new BadRequestException("No documents provided for pricing quote");
        }

        List<Document> documents = documentRepository.findByIdInAndUserId(request.getDocumentIds(), userId);
        if (documents.size() != request.getDocumentIds().size()) {
            throw new BadRequestException("One or more selected documents do not exist or do not belong to you");
        }

        int totalPages = documents.stream().mapToInt(Document::getPageCount).sum();
        int copies = Math.min(10, Math.max(1, request.getCopies()));
        String colorMode = "COLOR".equalsIgnoreCase(request.getColorMode()) ? "COLOR" : "BW";
        String printSides = "DOUBLE".equalsIgnoreCase(request.getPrintSides()) ? "DOUBLE" : "SINGLE";

        return calculatePrice(documents.size(), totalPages, copies, colorMode, printSides);
    }

    public PricingQuoteResponse calculatePrice(int documentCount, int totalPages, int copies, String colorMode, String printSides) {
        PricingConfiguration config = pricingConfigRepository
                .findFirstByIsActiveTrueOrderByEffectiveFromDesc()
                .orElse(null);

        BigDecimal bwRate = config != null ? config.getBwPricePerPage() : defaultBwPrice;
        BigDecimal colorRate = config != null ? config.getColorPricePerPage() : defaultColorPrice;
        BigDecimal discountPercent = config != null ? config.getDoubleSideDiscountPercent() : defaultDoubleSideDiscount;
        String version = config != null ? config.getConfigVersion() : "v1.0";
        String currency = config != null ? config.getCurrency() : "INR";

        BigDecimal ratePerPage = "COLOR".equalsIgnoreCase(colorMode) ? colorRate : bwRate;
        int totalChargeablePages = totalPages * copies;

        BigDecimal baseAmount = ratePerPage
                .multiply(BigDecimal.valueOf(totalChargeablePages))
                .setScale(2, RoundingMode.HALF_UP);

        BigDecimal discountAmount = BigDecimal.ZERO.setScale(2, RoundingMode.HALF_UP);
        if ("DOUBLE".equalsIgnoreCase(printSides)) {
            BigDecimal discountMultiplier = discountPercent.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP);
            discountAmount = baseAmount.multiply(discountMultiplier).setScale(2, RoundingMode.HALF_UP);
        }

        BigDecimal finalAmount = baseAmount.subtract(discountAmount).setScale(2, RoundingMode.HALF_UP);

        PricingQuoteResponse response = new PricingQuoteResponse();
        response.setDocumentCount(documentCount);
        response.setTotalPages(totalPages);
        response.setCopies(copies);
        response.setTotalChargeablePages(totalChargeablePages);
        response.setColorMode(colorMode);
        response.setPrintSides(printSides);
        response.setRatePerPage(ratePerPage);
        response.setBaseAmount(baseAmount);
        response.setDiscountPercentage("DOUBLE".equalsIgnoreCase(printSides) ? discountPercent : BigDecimal.ZERO);
        response.setDiscountAmount(discountAmount);
        response.setFinalAmount(finalAmount);
        response.setCurrency(currency);
        response.setPricingVersion(version);

        return response;
    }
}
