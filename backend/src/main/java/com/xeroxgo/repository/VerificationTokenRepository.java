package com.xeroxgo.repository;

import com.xeroxgo.entity.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByTokenHashAndTokenTypeAndUsedAtIsNull(String tokenHash, String tokenType);
    Optional<VerificationToken> findFirstByUserIdAndTokenTypeAndUsedAtIsNullOrderByCreatedAtDesc(Long userId, String tokenType);
}
