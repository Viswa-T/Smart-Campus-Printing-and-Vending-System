package com.xeroxgo.controller;

import com.xeroxgo.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    private final JdbcTemplate jdbcTemplate;

    public HealthController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("application", "XeroxGo Backend");
        health.put("timestamp", LocalDateTime.now());

        boolean dbReady = false;
        try {
            Integer result = jdbcTemplate.queryForObject("SELECT 1", Integer.class);
            dbReady = (result != null && result == 1);
        } catch (Exception ignored) {
            dbReady = false;
        }

        health.put("databaseConnected", dbReady);
        return ResponseEntity.ok(ApiResponse.success(health));
    }
}
