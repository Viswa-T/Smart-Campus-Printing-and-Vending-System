package com.xeroxgo.repository;

import com.xeroxgo.entity.Machine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {
    List<Machine> findByCollegeIdAndIsActiveTrue(Long collegeId);
    List<Machine> findByIsActiveTrue();
    Optional<Machine> findByMachineCode(String machineCode);
}
