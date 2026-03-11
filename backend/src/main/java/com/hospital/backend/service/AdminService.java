package com.hospital.backend.service;

import com.hospital.backend.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final AppointmentRepository appointmentRepository;

    public List<Map<String, Object>> getAppointmentsPerDoctor() {
        List<Object[]> results = appointmentRepository.countAppointmentsPerDoctor();
        return results.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("doctorName", row[0]);
            map.put("appointmentCount", row[1]);
            return map;
        }).toList();
    }
}
