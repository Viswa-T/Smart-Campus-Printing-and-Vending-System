package com.xeroxgo.service;

import com.xeroxgo.dto.MachineDto;
import com.xeroxgo.entity.College;
import com.xeroxgo.entity.Machine;
import com.xeroxgo.exception.ResourceNotFoundException;
import com.xeroxgo.repository.CollegeRepository;
import com.xeroxgo.repository.MachineRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MachineService {

    private final MachineRepository machineRepository;
    private final CollegeRepository collegeRepository;

    public MachineService(MachineRepository machineRepository, CollegeRepository collegeRepository) {
        this.machineRepository = machineRepository;
        this.collegeRepository = collegeRepository;
    }

    public List<MachineDto> getMachines(Long collegeId) {
        List<Machine> machines;
        if (collegeId != null) {
            machines = machineRepository.findByCollegeIdAndIsActiveTrue(collegeId);
        } else {
            machines = machineRepository.findByIsActiveTrue();
        }

        return machines.stream().map(m -> {
            String collegeName = collegeRepository.findById(m.getCollegeId())
                    .map(College::getCollegeName).orElse("Campus");
            return mapToDto(m, collegeName);
        }).collect(Collectors.toList());
    }

    public MachineDto getMachineById(Long machineId) {
        Machine machine = machineRepository.findById(machineId)
                .orElseThrow(() -> new ResourceNotFoundException("Machine not found with id: " + machineId));
        String collegeName = collegeRepository.findById(machine.getCollegeId())
                .map(College::getCollegeName).orElse("Campus");
        return mapToDto(machine, collegeName);
    }

    private MachineDto mapToDto(Machine machine, String collegeName) {
        MachineDto dto = new MachineDto();
        dto.setId(machine.getId());
        dto.setCollegeId(machine.getCollegeId());
        dto.setCollegeName(collegeName);
        dto.setMachineCode(machine.getMachineCode());
        dto.setMachineName(machine.getMachineName());
        dto.setLocationDescription(machine.getLocationDescription());
        dto.setAddress(machine.getAddress());
        dto.setOperationalStatus(machine.getOperationalStatus());
        dto.setSupportedColorModes(machine.getSupportedColorModes());
        dto.setSupportedPrintSides(machine.getSupportedPrintSides());
        dto.setActive(machine.isActive());
        return dto;
    }
}
