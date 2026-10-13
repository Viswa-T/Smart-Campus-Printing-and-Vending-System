package com.xeroxgo.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class CreateOrderRequest {

    @NotNull(message = "College is required")
    private Long collegeId;

    @NotNull(message = "Printing machine is required")
    private Long machineId;

    @NotEmpty(message = "At least one document must be selected")
    private List<Long> documentIds;

    @NotNull(message = "Color mode is required")
    private String colorMode = "BW";

    @NotNull(message = "Print sides is required")
    private String printSides = "SINGLE";

    @Min(value = 1, message = "Copies must be between 1 and 10")
    @Max(value = 10, message = "Copies must be between 1 and 10")
    private int copies = 1;

    public CreateOrderRequest() {}

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

    public Long getMachineId() { return machineId; }
    public void setMachineId(Long machineId) { this.machineId = machineId; }

    public List<Long> getDocumentIds() { return documentIds; }
    public void setDocumentIds(List<Long> documentIds) { this.documentIds = documentIds; }

    public String getColorMode() { return colorMode; }
    public void setColorMode(String colorMode) { this.colorMode = colorMode; }

    public String getPrintSides() { return printSides; }
    public void setPrintSides(String printSides) { this.printSides = printSides; }

    public int getCopies() { return copies; }
    public void setCopies(int copies) { this.copies = copies; }
}
