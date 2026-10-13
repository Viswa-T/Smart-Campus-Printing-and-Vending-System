package com.xeroxgo.dto;

public class MachineDto {
    private Long id;
    private Long collegeId;
    private String collegeName;
    private String machineCode;
    private String machineName;
    private String locationDescription;
    private String address;
    private String operationalStatus;
    private int availableSlots;
    private String supportedColorModes;
    private String supportedPrintSides;
    private boolean isActive;

    public MachineDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getMachineCode() { return machineCode; }
    public void setMachineCode(String machineCode) { this.machineCode = machineCode; }

    public String getMachineName() { return machineName; }
    public void setMachineName(String machineName) { this.machineName = machineName; }

    public String getLocationDescription() { return locationDescription; }
    public void setLocationDescription(String locationDescription) { this.locationDescription = locationDescription; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getOperationalStatus() { return operationalStatus; }
    public void setOperationalStatus(String operationalStatus) { this.operationalStatus = operationalStatus; }

    public int getAvailableSlots() { return availableSlots; }
    public void setAvailableSlots(int availableSlots) { this.availableSlots = availableSlots; }

    public String getSupportedColorModes() { return supportedColorModes; }
    public void setSupportedColorModes(String supportedColorModes) { this.supportedColorModes = supportedColorModes; }

    public String getSupportedPrintSides() { return supportedPrintSides; }
    public void setSupportedPrintSides(String supportedPrintSides) { this.supportedPrintSides = supportedPrintSides; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }
}
