package com.xeroxgo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class PricingQuoteRequest {

    @NotEmpty(message = "At least one document must be selected")
    private List<Long> documentIds;

    @NotNull(message = "Color mode is required")
    private String colorMode = "BW"; // BW or COLOR

    @NotNull(message = "Printing sides setting is required")
    private String printSides = "SINGLE"; // SINGLE or DOUBLE

    @Min(value = 1, message = "Copies must be between 1 and 10")
    @Max(value = 10, message = "Copies must be between 1 and 10")
    private int copies = 1;

    public PricingQuoteRequest() {}

    public List<Long> getDocumentIds() { return documentIds; }
    public void setDocumentIds(List<Long> documentIds) { this.documentIds = documentIds; }

    public String getColorMode() { return colorMode; }
    public void setColorMode(String colorMode) { this.colorMode = colorMode; }

    public String getPrintSides() { return printSides; }
    public void setPrintSides(String printSides) { this.printSides = printSides; }

    public int getCopies() { return copies; }
    public void setCopies(int copies) { this.copies = copies; }
}
