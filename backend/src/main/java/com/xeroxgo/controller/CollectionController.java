package com.xeroxgo.controller;

import com.xeroxgo.dto.ApiResponse;
import com.xeroxgo.dto.CollectionCompleteRequest;
import com.xeroxgo.dto.CollectionValidateRequest;
import com.xeroxgo.dto.CollectionValidateResponse;
import com.xeroxgo.service.CollectionService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/collection")
public class CollectionController {

    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<CollectionValidateResponse>> validateCollectionCode(
            @Valid @RequestBody CollectionValidateRequest request) {
        CollectionValidateResponse response = collectionService.validateCollectionCode(request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping("/complete")
    public ResponseEntity<ApiResponse<Void>> completeCollection(
            @Valid @RequestBody CollectionCompleteRequest request) {
        collectionService.completeCollection(request);
        return ResponseEntity.ok(ApiResponse.success("Document collection recorded successfully", null));
    }
}
