package com.xeroxgo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "machines")
public class Machine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "college_id", nullable = false)
    private Long collegeId;

    @Column(name = "machine_code", nullable = false, unique = true)
    private String machineCode;

    @Column(name = "machine_name", nullable = false)
    private String machineName;

    @Column(name = "location_description", nullable = false)
    private String locationDescription;

    @Column(name = "address", columnDefinition = "TEXT")
    private String address;

    @Column(name = "operational_status", nullable = false)
    private String operationalStatus = "ACTIVE"; // ACTIVE, BUSY, OFFLINE, MAINTENANCE

    @Column(name = "supported_color_modes", nullable = false)
    private String supportedColorModes = "BW,COLOR";

    @Column(name = "supported_print_sides", nullable = false)
    private String supportedPrintSides = "SINGLE,DOUBLE";

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "last_status_update", nullable = false)
    private LocalDateTime lastStatusUpdate = LocalDateTime.now();

    public Machine() {}

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCollegeId() { return collegeId; }
    public void setCollegeId(Long collegeId) { this.collegeId = collegeId; }

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

    public String getSupportedColorModes() { return supportedColorModes; }
    public void setSupportedColorModes(String supportedColorModes) { this.supportedColorModes = supportedColorModes; }

    public String getSupportedPrintSides() { return supportedPrintSides; }
    public void setSupportedPrintSides(String supportedPrintSides) { this.supportedPrintSides = supportedPrintSides; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getLastStatusUpdate() { return lastStatusUpdate; }
    public void setLastStatusUpdate(LocalDateTime lastStatusUpdate) { this.lastStatusUpdate = lastStatusUpdate; }
}
