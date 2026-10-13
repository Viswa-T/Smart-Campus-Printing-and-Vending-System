package com.xeroxgo.service;

import com.xeroxgo.dto.DocumentDto;
import com.xeroxgo.dto.PagedResponse;
import com.xeroxgo.entity.Document;
import com.xeroxgo.entity.User;
import com.xeroxgo.exception.BadRequestException;
import com.xeroxgo.exception.ResourceNotFoundException;
import com.xeroxgo.exception.UnauthorizedException;
import com.xeroxgo.repository.DocumentRepository;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final AuthService authService;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("pdf", "doc", "docx", "jpg", "jpeg", "png");

    public DocumentService(DocumentRepository documentRepository, AuthService authService) {
        this.documentRepository = documentRepository;
        this.authService = authService;
    }

    @Transactional
    public DocumentDto uploadDocument(MultipartFile file, Long userId) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            originalFilename = "uploaded_document";
        }
        originalFilename = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");

        String extension = getFileExtension(originalFilename).toLowerCase();
        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Unsupported file type: ." + extension + ". Allowed: PDF, DOC, DOCX, JPG, JPEG, PNG");
        }

        byte[] bytes;
        try {
            bytes = file.getBytes();
        } catch (IOException e) {
            throw new BadRequestException("Failed to read uploaded file contents");
        }

        int pageCount = extractPageCount(bytes, extension);
        String contentType = file.getContentType();
        if (contentType == null || contentType.isEmpty()) {
            contentType = "application/octet-stream";
        }

        Document document = new Document(
                userId,
                originalFilename,
                contentType,
                file.getSize(),
                pageCount,
                bytes
        );

        document = documentRepository.save(document);
        return mapToDto(document);
    }

    public List<DocumentDto> getUserDocuments(Long userId) {
        return documentRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public PagedResponse<DocumentDto> getUserDocumentsPaged(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.min(50, Math.max(1, size)));
        Page<Document> docPage = documentRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);

        List<DocumentDto> dtos = docPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return new PagedResponse<>(
                dtos,
                docPage.getNumber(),
                docPage.getSize(),
                docPage.getTotalElements(),
                docPage.getTotalPages()
        );
    }

    public Document getDocumentEntity(Long documentId, Long userId) {
        Document document = documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id: " + documentId));

        if (!document.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to access this document");
        }
        return document;
    }

    public DocumentDto getDocumentDto(Long documentId, Long userId) {
        return mapToDto(getDocumentEntity(documentId, userId));
    }

    @Transactional
    public void deleteDocument(Long documentId, Long userId) {
        Document document = getDocumentEntity(documentId, userId);
        documentRepository.delete(document);
    }

    public int extractPageCount(byte[] bytes, String extension) {
        try {
            switch (extension) {
                case "pdf":
                    try (PDDocument pdf = Loader.loadPDF(bytes)) {
                        return Math.max(1, pdf.getNumberOfPages());
                    }
                case "docx":
                    try (XWPFDocument docx = new XWPFDocument(new ByteArrayInputStream(bytes))) {
                        int pages = docx.getProperties().getExtendedProperties().getPages();
                        if (pages > 0) return pages;
                        // Approximate based on paragraphs if metadata is not finalized
                        int paragraphs = docx.getParagraphs().size();
                        return Math.max(1, (int) Math.ceil(paragraphs / 10.0));
                    }
                case "doc":
                    // Legacy binary doc default estimate
                    return Math.max(1, (int) Math.ceil(bytes.length / 45000.0));
                case "jpg":
                case "jpeg":
                case "png":
                    return 1;
                default:
                    return 1;
            }
        } catch (Exception e) {
            // Safe fallback if parsing encounters partial document structures
            return 1;
        }
    }

    private String getFileExtension(String filename) {
        int dotIndex = filename.lastIndexOf('.');
        return (dotIndex > 0 && dotIndex < filename.length() - 1) ? filename.substring(dotIndex + 1) : "";
    }

    public DocumentDto mapToDto(Document doc) {
        return new DocumentDto(
                doc.getId(),
                doc.getOriginalFilename(),
                doc.getDetectedMimeType(),
                doc.getFileSizeBytes(),
                formatBytes(doc.getFileSizeBytes()),
                doc.getPageCount(),
                doc.getProcessingStatus(),
                doc.getCreatedAt()
        );
    }

    private String formatBytes(Long bytes) {
        if (bytes == null || bytes == 0) return "0 Bytes";
        long k = 1024;
        String[] sizes = {"Bytes", "KB", "MB", "GB"};
        int i = (int) Math.floor(Math.log(bytes) / Math.log(k));
        if (i >= sizes.length) i = sizes.length - 1;
        double formatted = bytes / Math.pow(k, i);
        return String.format("%.1f %s", formatted, sizes[i]);
    }
}
