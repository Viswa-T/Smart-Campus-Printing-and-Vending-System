package com.xeroxgo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "original_filename", nullable = false)
    private String originalFilename;

    @Column(name = "detected_mime_type", nullable = false)
    private String detectedMimeType;

    @Column(name = "file_size_bytes", nullable = false)
    private Long fileSizeBytes;

    @Column(name = "page_count", nullable = false)
    private int pageCount = 1;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    @Column(name = "file_data", nullable = false, columnDefinition = "LONGBLOB")
    private byte[] fileData;

    @Column(name = "processing_status", nullable = false)
    private String processingStatus = "COMPLETED"; // PENDING, PROCESSING, COMPLETED, FAILED

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "retention_until")
    private LocalDateTime retentionUntil;

    public Document() {}

    public Document(Long userId, String originalFilename, String detectedMimeType, Long fileSizeBytes, int pageCount, byte[] fileData) {
        this.userId = userId;
        this.originalFilename = originalFilename;
        this.detectedMimeType = detectedMimeType;
        this.fileSizeBytes = fileSizeBytes;
        this.pageCount = pageCount;
        this.fileData = fileData;
        this.processingStatus = "COMPLETED";
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.retentionUntil = LocalDateTime.now().plusDays(30);
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getOriginalFilename() { return originalFilename; }
    public void setOriginalFilename(String originalFilename) { this.originalFilename = originalFilename; }

    public String getDetectedMimeType() { return detectedMimeType; }
    public void setDetectedMimeType(String detectedMimeType) { this.detectedMimeType = detectedMimeType; }

    public Long getFileSizeBytes() { return fileSizeBytes; }
    public void setFileSizeBytes(Long fileSizeBytes) { this.fileSizeBytes = fileSizeBytes; }

    public int getPageCount() { return pageCount; }
    public void setPageCount(int pageCount) { this.pageCount = pageCount; }

    public byte[] getFileData() { return fileData; }
    public void setFileData(byte[] fileData) { this.fileData = fileData; }

    public String getProcessingStatus() { return processingStatus; }
    public void setProcessingStatus(String processingStatus) { this.processingStatus = processingStatus; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public LocalDateTime getRetentionUntil() { return retentionUntil; }
    public void setRetentionUntil(LocalDateTime retentionUntil) { this.retentionUntil = retentionUntil; }
}
