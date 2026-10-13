package com.xeroxgo.controller;

import com.xeroxgo.dto.ApiResponse;
import com.xeroxgo.dto.DocumentDto;
import com.xeroxgo.dto.PagedResponse;
import com.xeroxgo.entity.Document;
import com.xeroxgo.entity.User;
import com.xeroxgo.service.AuthService;
import com.xeroxgo.service.DocumentService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/v1/documents")
public class DocumentController {

    private final DocumentService documentService;
    private final AuthService authService;

    public DocumentController(DocumentService documentService, AuthService authService) {
        this.documentService = documentService;
        this.authService = authService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<DocumentDto>> uploadDocument(@RequestParam("file") MultipartFile file) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        DocumentDto uploaded = documentService.uploadDocument(file, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Document uploaded successfully", uploaded));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentDto>>> getUserDocuments() {
        User currentUser = authService.getCurrentAuthenticatedUser();
        List<DocumentDto> docs = documentService.getUserDocuments(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(docs));
    }

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<PagedResponse<DocumentDto>>> getUserDocumentsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        PagedResponse<DocumentDto> docs = documentService.getUserDocumentsPaged(currentUser.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.success(docs));
    }

    @GetMapping("/{documentId}")
    public ResponseEntity<ApiResponse<DocumentDto>> getDocumentMetadata(@PathVariable Long documentId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        DocumentDto doc = documentService.getDocumentDto(documentId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(doc));
    }

    @GetMapping("/{documentId}/content")
    public ResponseEntity<byte[]> getDocumentContent(@PathVariable Long documentId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        Document doc = documentService.getDocumentEntity(documentId, currentUser.getId());

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(doc.getDetectedMimeType());
        } catch (Exception e) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + doc.getOriginalFilename() + "\"")
                .body(doc.getFileData());
    }

    @DeleteMapping("/{documentId}")
    public ResponseEntity<ApiResponse<Void>> deleteDocument(@PathVariable Long documentId) {
        User currentUser = authService.getCurrentAuthenticatedUser();
        documentService.deleteDocument(documentId, currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success("Document removed successfully", null));
    }
}
