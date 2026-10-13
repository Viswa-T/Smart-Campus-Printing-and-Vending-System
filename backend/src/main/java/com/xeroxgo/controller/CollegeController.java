package com.xeroxgo.controller;

import com.xeroxgo.dto.ApiResponse;
import com.xeroxgo.dto.CollegeDetailDto;
import com.xeroxgo.dto.CollegeDto;
import com.xeroxgo.dto.MachineDto;
import com.xeroxgo.dto.PagedResponse;
import com.xeroxgo.service.CollegeService;
import com.xeroxgo.service.MachineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/colleges")
public class CollegeController {

    private final CollegeService collegeService;
    private final MachineService machineService;

    public CollegeController(CollegeService collegeService, MachineService machineService) {
        this.collegeService = collegeService;
        this.machineService = machineService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<CollegeDto>>> getColleges(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<CollegeDto> colleges = collegeService.searchColleges(search, city, state, page, size);
        return ResponseEntity.ok(ApiResponse.success(colleges));
    }

    @GetMapping("/{collegeId}")
    public ResponseEntity<ApiResponse<CollegeDetailDto>> getCollegeById(@PathVariable Long collegeId) {
        CollegeDetailDto detail = collegeService.getCollegeDetail(collegeId);
        return ResponseEntity.ok(ApiResponse.success(detail));
    }

    @GetMapping("/{collegeId}/machines")
    public ResponseEntity<ApiResponse<List<MachineDto>>> getMachinesForCollege(@PathVariable Long collegeId) {
        List<MachineDto> machines = machineService.getMachines(collegeId);
        return ResponseEntity.ok(ApiResponse.success(machines));
    }
}
