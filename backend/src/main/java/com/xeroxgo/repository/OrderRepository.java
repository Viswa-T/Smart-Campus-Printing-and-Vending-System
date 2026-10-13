package com.xeroxgo.repository;

import com.xeroxgo.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;


import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("SELECT o FROM Order o WHERE o.id = :id")
        Optional<Order> findByIdForUpdate(@Param("id") Long id);

        @Lock(LockModeType.PESSIMISTIC_WRITE)
        @Query("SELECT o FROM Order o WHERE o.publicOrderReference = :reference")
        Optional<Order> findByPublicOrderReferenceForUpdate(
                @Param("reference") String reference
    );

    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Order> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Page<Order> findByUserIdAndOrderStatusOrderByCreatedAtDesc(Long userId, String orderStatus, Pageable pageable);
    Optional<Order> findByIdAndUserId(Long id, Long userId);
    Optional<Order> findByPublicOrderReference(String publicOrderReference);
    Optional<Order> findByPublicOrderReferenceAndUserId(String publicOrderReference, Long userId);
}
