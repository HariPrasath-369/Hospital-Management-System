package com.hospital.backend.repository;

import com.hospital.backend.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    List<Appointment> findByPatientIdOrderByAppointmentDateDescStartTimeDesc(UUID patientId);
    List<Appointment> findByDoctorIdOrderByAppointmentDateDescStartTimeDesc(UUID doctorId);
    
    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.doctor.id = :doctorId " +
           "AND a.appointmentDate = :date AND a.status != 'CANCELLED' " +
           "AND (a.startTime < :endTime AND a.endTime > :startTime)")
    boolean existsOverlappingDoctorAppointment(
        @Param("doctorId") UUID doctorId, 
        @Param("date") LocalDate date, 
        @Param("startTime") LocalTime startTime, 
        @Param("endTime") LocalTime endTime);
        
    @Query("SELECT COUNT(a) > 0 FROM Appointment a WHERE a.patient.id = :patientId " +
           "AND a.appointmentDate = :date AND a.status != 'CANCELLED' " +
           "AND (a.startTime < :endTime AND a.endTime > :startTime)")
    boolean existsOverlappingPatientAppointment(
        @Param("patientId") UUID patientId, 
        @Param("date") LocalDate date, 
        @Param("startTime") LocalTime startTime, 
        @Param("endTime") LocalTime endTime);

    @Query("SELECT a.doctor.name, COUNT(a) FROM Appointment a GROUP BY a.doctor.name")
    List<Object[]> countAppointmentsPerDoctor();
}
