package com.hospital.backend.service;

import com.hospital.backend.dto.Dtos.*;
import com.hospital.backend.exception.BadRequestException;
import com.hospital.backend.exception.ResourceNotFoundException;
import com.hospital.backend.model.Appointment;
import com.hospital.backend.model.Role;
import com.hospital.backend.model.Status;
import com.hospital.backend.model.User;
import com.hospital.backend.repository.AppointmentRepository;
import com.hospital.backend.repository.AvailableSlotRepository;
import com.hospital.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final AvailableSlotRepository slotRepository;

    public AppointmentDto bookAppointment(UUID patientId, AppointmentRequest request) {
        User patient = userRepository.findById(patientId)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found"));
                
        User doctor = userRepository.findById(request.getDoctorId())
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));
                
        if (doctor.getRole() != Role.DOCTOR) {
            throw new BadRequestException("User is not a doctor");
        }

        // Rule 1: Cannot book overlapping time slots for a doctor
        boolean doctorBusy = appointmentRepository.existsOverlappingDoctorAppointment(
                doctor.getId(), request.getDate(), request.getStartTime(), request.getEndTime());
        if (doctorBusy) {
            throw new BadRequestException("Doctor is not available at this time. Slot overlaps with another appointment.");
        }

        // Rule 2: Patient cannot book multiple appointments at same time
        boolean patientBusy = appointmentRepository.existsOverlappingPatientAppointment(
                patient.getId(), request.getDate(), request.getStartTime(), request.getEndTime());
        if (patientBusy) {
            throw new BadRequestException("You already have an appointment booked at this time.");
        }
        
        // Rule 3: Doctor must have an available slot
        boolean slotExists = slotRepository.findByDoctorIdAndDateGreaterThanEqualOrderByDateAscStartTimeAsc(doctor.getId(), request.getDate())
            .stream()
            .anyMatch(slot -> slot.getDate().equals(request.getDate()) &&
                              !request.getStartTime().isBefore(slot.getStartTime()) &&
                              !request.getEndTime().isAfter(slot.getEndTime()));
                              
        if (!slotExists) {
            throw new BadRequestException("Doctor does not have an availability slot for this time.");
        }

        Appointment appointment = Appointment.builder()
                .patient(patient)
                .doctor(doctor)
                .appointmentDate(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .status(Status.BOOKED)
                .build();

        appointment = appointmentRepository.save(appointment);
        return mapToDto(appointment);
    }

    public List<AppointmentDto> getPatientAppointments(UUID patientId) {
        return appointmentRepository.findByPatientIdOrderByAppointmentDateDescStartTimeDesc(patientId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public List<AppointmentDto> getDoctorAppointments(UUID doctorId) {
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateDescStartTimeDesc(doctorId)
                .stream().map(this::mapToDto).collect(Collectors.toList());
    }

    public AppointmentDto updateStatus(UUID appointmentId, UUID userId, Status newStatus, Role role) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Appointment not found"));
                
        if (role == Role.DOCTOR) {
            if (!appointment.getDoctor().getId().equals(userId)) {
                throw new BadRequestException("You can only manage your own appointments");
            }
            if (newStatus == Status.CONFIRMED && appointment.getStatus() != Status.BOOKED) {
                 throw new BadRequestException("Only BOOKED appointments can be confirmed");
            }
            if (newStatus == Status.COMPLETED && appointment.getStatus() != Status.CONFIRMED) {
                 throw new BadRequestException("Only CONFIRMED appointments can be completed");
            }
            if (newStatus != Status.CONFIRMED && newStatus != Status.COMPLETED) {
                 throw new BadRequestException("Doctors can only transition to CONFIRMED or COMPLETED");
            }
        } else if (role == Role.ADMIN) {
             if (newStatus != Status.CANCELLED) {
                  throw new BadRequestException("Admins can only CANCEL appointments");
             }
        } else {
             throw new BadRequestException("Unauthorized status update");
        }

        appointment.setStatus(newStatus);
        return mapToDto(appointmentRepository.save(appointment));
    }

    private AppointmentDto mapToDto(Appointment a) {
        return new AppointmentDto(a.getId(), a.getPatient().getName(), a.getDoctor().getName(),
                a.getAppointmentDate(), a.getStartTime(), a.getEndTime(), a.getStatus().name());
    }
}
