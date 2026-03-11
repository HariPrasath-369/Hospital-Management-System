package com.hospital.backend.controller;

import com.hospital.backend.dto.Dtos.*;
import com.hospital.backend.model.User;
import com.hospital.backend.service.AppointmentService;
import com.hospital.backend.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class PatientController {

    private final DoctorService doctorService;
    private final AppointmentService appointmentService;

    // Public API
    @GetMapping("/api/public/doctors")
    public ResponseEntity<List<DoctorDto>> getDoctors() {
        return ResponseEntity.ok(doctorService.getAllDoctors());
    }

    // Public API
    @GetMapping("/api/public/doctors/{doctorId}/slots")
    public ResponseEntity<List<SlotDto>> getDoctorSlots(
            @PathVariable UUID doctorId,
            @RequestParam(required = false) LocalDate fromDate) {
        if (fromDate == null) fromDate = LocalDate.now();
        return ResponseEntity.ok(doctorService.getDoctorSlots(doctorId, fromDate));
    }

    // Protected Patient APIs
    @PostMapping("/api/patient/appointments")
    public ResponseEntity<AppointmentDto> bookAppointment(
            @AuthenticationPrincipal User user,
            @RequestBody AppointmentRequest request) {
        return ResponseEntity.ok(appointmentService.bookAppointment(user.getId(), request));
    }

    @GetMapping("/api/patient/appointments")
    public ResponseEntity<List<AppointmentDto>> getMyAppointments(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(appointmentService.getPatientAppointments(user.getId()));
    }
}
