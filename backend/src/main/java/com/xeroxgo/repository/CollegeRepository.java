package com.xeroxgo.repository;

import com.xeroxgo.entity.College;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CollegeRepository extends JpaRepository<College, Long> {

    @Query("SELECT c FROM College c WHERE c.isActive = true AND (" +
           "LOWER(c.collegeName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.normalizedName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "(c.abbreviation IS NOT NULL AND LOWER(c.abbreviation) LIKE LOWER(CONCAT('%', :query, '%'))) OR " +
           "LOWER(c.city) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(c.state) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<College> searchColleges(@Param("query") String query, Pageable pageable);

    @Query("SELECT c FROM College c WHERE c.isActive = true AND " +
           "(:city IS NULL OR LOWER(c.city) = LOWER(:city)) AND " +
           "(:state IS NULL OR LOWER(c.state) = LOWER(:state))")
    Page<College> findFiltered(@Param("city") String city, @Param("state") String state, Pageable pageable);

    List<College> findByIsActiveTrueOrderByCollegeNameAsc();
}
