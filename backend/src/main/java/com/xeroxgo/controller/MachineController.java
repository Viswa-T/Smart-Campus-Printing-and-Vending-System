package com.xeroxgo.controller;

import com.xeroxgo.dto.ApiResponse;
import com.xeroxgo.dto.MachineDto;
import com.xeroxgo.service.MachineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/machines")
public class MachineController {

    private final MachineService machineService;

    public MachineController(MachineService machineService) {
        this.machineService = machineService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<MachineDto>>> getAllMachines(@RequestParam(required = false) Long collegeId) {
        List<MachineDto> machines = machineService.getMachines(collegeId);
        return ResponseEntity.ok(ApiResponse.success(machines));
    }

    @GetMapping("/{machineId}")
    public ResponseEntity<ApiResponse<MachineDto>> getMachineById(@PathVariable Long machineId) {
        MachineDto machine = machineService.getMachineById(machineId);
        return ResponseEntity.ok(ApiResponse.success(machine));
    }
}
