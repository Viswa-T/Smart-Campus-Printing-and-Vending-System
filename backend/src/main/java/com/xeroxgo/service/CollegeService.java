package com.xeroxgo.service;

import com.xeroxgo.dto.CollegeDetailDto;
import com.xeroxgo.dto.CollegeDto;
import com.xeroxgo.dto.MachineDto;
import com.xeroxgo.dto.PagedResponse;
import com.xeroxgo.entity.College;
import com.xeroxgo.entity.Machine;
import com.xeroxgo.exception.ResourceNotFoundException;
import com.xeroxgo.repository.CollegeRepository;
import com.xeroxgo.repository.MachineRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CollegeService {

    private final CollegeRepository collegeRepository;
    private final MachineRepository machineRepository;

    public CollegeService(CollegeRepository collegeRepository, MachineRepository machineRepository) {
        this.collegeRepository = collegeRepository;
        this.machineRepository = machineRepository;
    }

    public PagedResponse<CollegeDto> searchColleges(String query, String city, String state, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(100, Math.max(1, size)), Sort.by("collegeName").ascending());
        Page<College> collegePage;

        if (query != null && !query.trim().isEmpty()) {
            collegePage = collegeRepository.searchColleges(query.trim(), pageable);
        } else {
            collegePage = collegeRepository.findFiltered(
                    city != null && !city.trim().isEmpty() ? city.trim() : null,
                    state != null && !state.trim().isEmpty() ? state.trim() : null,
                    pageable
            );
        }

        List<CollegeDto> dtoList = collegePage.getContent().stream()
                .map(this::mapToCollegeDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                dtoList,
                collegePage.getNumber(),
                collegePage.getSize(),
                collegePage.getTotalElements(),
                collegePage.getTotalPages()
        );
    }

    public CollegeDetailDto getCollegeDetail(Long collegeId) {
        College college = collegeRepository.findById(collegeId)
                .orElseThrow(() -> new ResourceNotFoundException("College not found with id: " + collegeId));

        List<Machine> machines = machineRepository.findByCollegeIdAndIsActiveTrue(collegeId);
        List<MachineDto> machineDtos = machines.stream()
                .map(m -> mapToMachineDto(m, college.getCollegeName()))
                .collect(Collectors.toList());

        return new CollegeDetailDto(mapToCollegeDto(college), machineDtos);
    }

    public CollegeDto mapToCollegeDto(College college) {
        List<Machine> machines = machineRepository.findByCollegeIdAndIsActiveTrue(college.getId());
        return new CollegeDto(
                college.getId(),
                college.getCollegeName(),
                college.getAbbreviation(),
                college.getCity(),
                college.getState(),
                college.getCountry(),
                college.getAddress(),
                college.getLogoUrl(),
                machines.size()
        );
    }

    public MachineDto mapToMachineDto(Machine machine, String collegeName) {
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
