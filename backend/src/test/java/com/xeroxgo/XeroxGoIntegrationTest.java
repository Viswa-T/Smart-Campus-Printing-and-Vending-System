package com.xeroxgo;

import com.xeroxgo.dto.*;
import com.xeroxgo.entity.User;
import com.xeroxgo.service.AuthService;
import com.xeroxgo.service.CollectionService;
import com.xeroxgo.service.CollegeService;
import com.xeroxgo.service.MachineService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class XeroxGoIntegrationTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private CollegeService collegeService;

    @Autowired
    private MachineService machineService;

    @Autowired
    private CollectionService collectionService;

    @Test
    @DisplayName("Initial seeded database must contain at least 50 distinct colleges")
    void testSeededCollegesCount() {
        PagedResponse<CollegeDto> response = collegeService.searchColleges(null, null, null, 0, 100);
        assertTrue(response.getTotalElements() >= 50, "Should have at least 50 colleges seeded");
    }

    @Test
    @DisplayName("College search should match name, abbreviation (e.g. SKCT, PSG Tech), and city")
    void testCollegeSearch() {
        // Search by abbreviation
        PagedResponse<CollegeDto> skctSearch = collegeService.searchColleges("SKCT", null, null, 0, 10);
        assertFalse(skctSearch.getItems().isEmpty());
        assertTrue(skctSearch.getItems().stream().anyMatch(c -> c.getCollegeName().contains("Sri Krishna")));

        // Search by city
        PagedResponse<CollegeDto> coimbatoreSearch = collegeService.searchColleges("Coimbatore", null, null, 0, 20);
        assertFalse(coimbatoreSearch.getItems().isEmpty());
        assertTrue(coimbatoreSearch.getItems().size() >= 5);
    }

    @Test
    @DisplayName("Machines directory should contain the prototype reference machines (VM001-VM004)")
    void testPrototypeVendingMachines() {
        List<MachineDto> machines = machineService.getMachines(null);
        assertFalse(machines.isEmpty());

        boolean hasEngineeringBlockA = machines.stream().anyMatch(m -> "VM001".equals(m.getMachineCode()));
        boolean hasLibraryGround = machines.stream().anyMatch(m -> "VM002".equals(m.getMachineCode()));
        boolean hasHostelBlockB = machines.stream().anyMatch(m -> "VM003".equals(m.getMachineCode()));
        boolean hasAdminBuilding = machines.stream().anyMatch(m -> "VM004".equals(m.getMachineCode()));

        assertTrue(hasEngineeringBlockA, "VM001 Engineering Block A must be present");
        assertTrue(hasLibraryGround, "VM002 Library Ground Floor must be present");
        assertTrue(hasHostelBlockB, "VM003 Hostel Block B must be present");
        assertTrue(hasAdminBuilding, "VM004 Admin Building must be present");
    }

    @Test
    @DisplayName("Student registration and authentication flow with BCrypt and token")
    void testUserRegistrationAndLogin() {
        RegisterRequest registerReq = new RegisterRequest();
        registerReq.setFullName("Arun Kumar");
        registerReq.setEmail("arun.test@psgtech.ac.in");
        registerReq.setPassword("Password@123");
        registerReq.setConfirmPassword("Password@123");
        registerReq.setCollegeId(1L);

        AuthResponse authRes = authService.register(registerReq);
        assertNotNull(authRes.getToken());
        assertEquals("Arun Kumar", authRes.getUser().getFullName());
        assertEquals("arun.test@psgtech.ac.in", authRes.getUser().getEmail());

        // Login with credentials
        LoginRequest loginReq = new LoginRequest();
        loginReq.setEmail("arun.test@psgtech.ac.in");
        loginReq.setPassword("Password@123");

        AuthResponse loginRes = authService.login(loginReq);
        assertNotNull(loginRes.getToken());
        assertEquals("Arun Kumar", loginRes.getUser().getFullName());
    }
}
