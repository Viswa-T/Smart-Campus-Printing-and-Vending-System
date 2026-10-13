package com.xeroxgo.dto;

public class CollegeDto {
    private Long id;
    private String collegeName;
    private String abbreviation;
    private String city;
    private String state;
    private String country;
    private String address;
    private String logoUrl;
    private int activeMachineCount;

    public CollegeDto() {}

    public CollegeDto(Long id, String collegeName, String abbreviation, String city, String state, String country, String address, String logoUrl, int activeMachineCount) {
        this.id = id;
        this.collegeName = collegeName;
        this.abbreviation = abbreviation;
        this.city = city;
        this.state = state;
        this.country = country;
        this.address = address;
        this.logoUrl = logoUrl;
        this.activeMachineCount = activeMachineCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCollegeName() { return collegeName; }
    public void setCollegeName(String collegeName) { this.collegeName = collegeName; }

    public String getAbbreviation() { return abbreviation; }
    public void setAbbreviation(String abbreviation) { this.abbreviation = abbreviation; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public int getActiveMachineCount() { return activeMachineCount; }
    public void setActiveMachineCount(int activeMachineCount) { this.activeMachineCount = activeMachineCount; }
}
