package com.xeroxgo.dto;

import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    private Long selectedCollegeId;

    public UpdateProfileRequest() {}

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public Long getSelectedCollegeId() { return selectedCollegeId; }
    public void setSelectedCollegeId(Long selectedCollegeId) { this.selectedCollegeId = selectedCollegeId; }
}
