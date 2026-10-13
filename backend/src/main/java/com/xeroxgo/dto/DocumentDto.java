package com.xeroxgo.dto;

import java.time.LocalDateTime;

public class DocumentDto {
    private Long id;
    private String originalFilename;
    private String detectedMimeType;
    private Long fileSizeBytes;
    private String formattedSize;
    private int pageCount;
    private String processingStatus;
    private LocalDateTime createdAt;

    public DocumentDto() {}

    public DocumentDto(Long id, String originalFilename, String detectedMimeType, Long fileSizeBytes, String formattedSize, int pageCount, String processingStatus, LocalDateTime createdAt) {
        this.id = id;
        this.originalFilename = originalFilename;
        this.detectedMimeType = detectedMimeType;
        this.fileSizeBytes = fileSizeBytes;
        this.formattedSize = formattedSize;
        this.pageCount = pageCount;
        this.processingStatus = processingStatus;
        this.createdAt = createdAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }

    public String getDetectedMimeType() { return detectedMimeType; }
    public void setDetectedMimeType(String detectedMimeType) { this.detectedMimeType = detectedMimeType; }

    public Long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public String getFormattedSize() { return formattedSize; }
    public void setFormattedSize(String formattedSize) { this.formattedSize = formattedSize; }

    public int getPageCount() { return pageCount; }
    public void setPageCount(int pageCount) { this.pageCount = pageCount; }

    public String getProcessingStatus() { return processingStatus; }
    public void setProcessingStatus(String processingStatus) { this.processingStatus = processingStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
