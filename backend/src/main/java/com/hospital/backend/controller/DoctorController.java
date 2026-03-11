package com.hospital.backend.controller;

import com.hospital.backend.dto.Dtos.*;
import com.hospital.backend.model.Role;
import com.hospital.backend.model.Status;
import com.hospital.backend.model.User;
import com.hospital.backend.service.AppointmentService;
import com.hospital.backend.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/doctor")
@RequiredArgsConstructor
public class DoctorController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;

    @PostMapping("/slots")
    public ResponseEntity<SlotDto> addSlot(@AuthenticationPrincipal User user, @RequestBody SlotRequest request) {
        return ResponseEntity.ok(doctorService.addSlot(user.getId(), request));
    }

    @GetMapping("/appointments")
    public ResponseEntity<List<AppointmentDto>> getAppointments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(appointmentService.getDoctorAppointments(user.getId()));
    }

    @PatchMapping("/appointments/{id}/status")
    public ResponseEntity<AppointmentDto> updateStatus(
            @PathVariable UUID id,
            @AuthenticationPrincipal User user,
            @RequestParam Status status) {
        return ResponseEntity.ok(appointmentService.updateStatus(id, user.getId(), status, Role.DOCTOR));
    }
}
