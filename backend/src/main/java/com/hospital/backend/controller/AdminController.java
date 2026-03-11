package com.hospital.backend.controller;

import com.hospital.backend.dto.Dtos.AppointmentDto;
import com.hospital.backend.model.Role;
import com.hospital.backend.model.Status;
import com.hospital.backend.model.User;
import com.hospital.backend.service.AdminService;
import com.hospital.backend.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final AppointmentService appointmentService;

    @PatchMapping("/appointments/{id}/cancel")
    public ResponseEntity<AppointmentDto> cancelAppointment(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, user.getId(), Status.CANCELLED, Role.ADMIN));
    }

    @GetMapping("/reports/appointments-per-doctor")
    public ResponseEntity<List<Map<String, Object>>> getAppointmentsPerDoctor() {
        return ResponseEntity.ok(adminService.getAppointmentsPerDoctor());
    }
}
