package com.xeroxgo.repository;

import com.xeroxgo.entity.AccessCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccessCodeRepository extends JpaRepository<AccessCode, Long> {
    Optional<AccessCode> findByOrderId(Long orderId);
    Optional<AccessCode> findByCodeHash(String codeHash);
    Optional<AccessCode> findByCode(String code);
}
