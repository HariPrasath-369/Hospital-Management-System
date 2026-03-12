package com.hospital.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class Dtos {
    
    @Data
    public static class LoginRequest {
        private String email;
        private String password;
    }

    @Data
    public static class RegisterRequest {
        private String name;
        private String email;
        private String password;
        private String role;
        private String specialization;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AuthResponse {
        private String token;
        private UUID id;
        private String name;
        private String email;
        private String role;
    }

    @Data
    public static class SlotRequest {
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
    }

    @Data
    public static class AppointmentRequest {
        private UUID doctorId;
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
    }

    @Data
    @AllArgsConstructor
    public static class AppointmentDto {
        private UUID id;
        private String patientName;
        private String doctorName;
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
        private String status;
    }
    
    @Data
    @AllArgsConstructor
    public static class DoctorDto {
        private UUID id;
        private String name;
        private String specialization;
    }
    
    @Data
    @AllArgsConstructor
    public static class SlotDto {
        private UUID id;
        private LocalDate date;
        private LocalTime startTime;
        private LocalTime endTime;
    }
}
