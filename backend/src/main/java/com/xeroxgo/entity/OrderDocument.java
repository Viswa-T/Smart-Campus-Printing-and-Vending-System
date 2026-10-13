package com.xeroxgo.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "order_documents")
public class OrderDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @Column(name = "document_id", nullable = false)
    private Long documentId;

    @Column(name = "page_count_at_order", nullable = false)
    private int pageCountAtOrder;

    @Column(name = "copies", nullable = false)
    private int copies = 1;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public OrderDocument() {}

    public OrderDocument(Long orderId, Long documentId, int pageCountAtOrder, int copies) {
        this.orderId = orderId;
        this.documentId = documentId;
        this.pageCountAtOrder = pageCountAtOrder;
        this.copies = copies;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getOrderId() { return orderId; }
    public void setOrderId(Long orderId) { this.orderId = orderId; }

    public Long getDocumentId() { return documentId; }
    public void setDocumentId(Long documentId) { this.documentId = documentId; }

    public int getPageCountAtOrder() { return pageCountAtOrder; }
    public void setPageCountAtOrder(int pageCountAtOrder) { this.pageCountAtOrder = pageCountAtOrder; }

    public int getCopies() { return copies; }
    public void setCopies(int copies) { this.copies = copies; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
