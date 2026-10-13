package com.xeroxgo.repository;

import com.xeroxgo.entity.UserCollegeMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserCollegeMembershipRepository extends JpaRepository<UserCollegeMembership, Long> {
    Optional<UserCollegeMembership> findByUserIdAndCollegeId(Long userId, Long collegeId);
    Optional<UserCollegeMembership> findByUserId(Long userId);
}
