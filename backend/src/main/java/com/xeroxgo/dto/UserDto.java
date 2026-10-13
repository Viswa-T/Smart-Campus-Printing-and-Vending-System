package com.xeroxgo.dto;

public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private boolean emailVerified;
    private String accountStatus;
    private Long selectedCollegeId;
    private String selectedCollegeName;

    public UserDto() {}

    public UserDto(Long id, String fullName, String email, boolean emailVerified, String accountStatus, Long selectedCollegeId, String selectedCollegeName) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.emailVerified = emailVerified;
        this.accountStatus = accountStatus;
        this.selectedCollegeId = selectedCollegeId;
        this.selectedCollegeName = selectedCollegeName;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public boolean isEmailVerified() { return emailVerified; }
    public void setEmailVerified(boolean emailVerified) { this.emailVerified = emailVerified; }

    public String getAccountStatus() { return accountStatus; }
    public void setAccountStatus(String accountStatus) { this.accountStatus = accountStatus; }

    public Long getSelectedCollegeId() { return selectedCollegeId; }
    public void setSelectedCollegeId(Long selectedCollegeId) { this.selectedCollegeId = selectedCollegeId; }

    public String getSelectedCollegeName() { return selectedCollegeName; }
    public void setSelectedCollegeName(String selectedCollegeName) { this.selectedCollegeName = selectedCollegeName; }
}
