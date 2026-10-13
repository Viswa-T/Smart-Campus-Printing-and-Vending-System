package com.xeroxgo.repository;

import com.xeroxgo.entity.Document;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Document> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Optional<Document> findByIdAndUserId(Long id, Long userId);
    List<Document> findByIdInAndUserId(List<Long> ids, Long userId);
}
