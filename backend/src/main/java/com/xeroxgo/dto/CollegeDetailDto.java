package com.xeroxgo.dto;

import java.util.List;

public class CollegeDetailDto {
    private CollegeDto college;
    private List<MachineDto> machines;

    public CollegeDetailDto() {}

    public CollegeDetailDto(CollegeDto college, List<MachineDto> machines) {
        this.college = college;
        this.machines = machines;
    }

    public CollegeDto getCollege() { return college; }
    public void setCollege(CollegeDto college) { this.college = college; }

    public List<MachineDto> getMachines() { return machines; }
    public void setMachines(List<MachineDto> machines) { this.machines = machines; }
}
