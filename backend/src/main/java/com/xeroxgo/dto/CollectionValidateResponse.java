package com.xeroxgo.dto;

import java.util.List;

public class CollectionValidateResponse {
    private boolean valid;
    private String message;
    private String orderReference;
    private String machineName;
    private int totalPages;
    private int copies;
    private String colorMode;
    private String printSides;
    private List<String> documentNames;

    public CollectionValidateResponse() {}

    public boolean isValid() { return valid; }
    public void setValid(boolean valid) { this.valid = valid; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getOrderReference() { return orderReference; }
    public void setOrderReference(String orderReference) { this.orderReference = orderReference; }

    public String getMachineName() { return machineName; }
    public void setMachineName(String machineName) { this.machineName = machineName; }

    public int getTotalPages() { return totalPages; }
    public void setTotalPages(int totalPages) { this.totalPages = totalPages; }

    public int getCopies() { return copies; }
    public void setCopies(int copies) { this.copies = copies; }

    public String getColorMode() { return colorMode; }
    public void setColorMode(String colorMode) { this.colorMode = colorMode; }

    public String getPrintSides() { return printSides; }
    public void setPrintSides(String printSides) { this.printSides = printSides; }

    public List<String> getDocumentNames() { return documentNames; }
    public void setDocumentNames(List<String> documentNames) { this.documentNames = documentNames; }
}
