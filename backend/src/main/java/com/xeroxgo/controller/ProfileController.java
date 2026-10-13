package com.xeroxgo.controller;

import com.xeroxgo.dto.ApiResponse;
import com.xeroxgo.dto.UpdateProfileRequest;
import com.xeroxgo.dto.UserDto;
import com.xeroxgo.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profile")
public class ProfileController {

    private final AuthService authService;

    public ProfileController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<UserDto>> getProfile() {
        UserDto profile = authService.getCurrentUserProfile();
        return ResponseEntity.ok(ApiResponse.success(profile));
    }

    @PatchMapping
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        UserDto updated = authService.updateProfile(request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }
}
