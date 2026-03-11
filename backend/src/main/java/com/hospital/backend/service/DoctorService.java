package com.hospital.backend.service;

import com.hospital.backend.dto.Dtos.DoctorDto;
import com.hospital.backend.dto.Dtos.SlotDto;
import com.hospital.backend.dto.Dtos.SlotRequest;
import com.hospital.backend.exception.ResourceNotFoundException;
import com.hospital.backend.model.AvailableSlot;
import com.hospital.backend.model.Role;
import com.hospital.backend.model.User;
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
public class DoctorService {

    private final UserRepository userRepository;
    private final AvailableSlotRepository slotRepository;

    public List<DoctorDto> getAllDoctors() {
        return userRepository.findByRole(Role.DOCTOR)
                .stream()
                .map(u -> new DoctorDto(u.getId(), u.getName(), u.getSpecialization()))
                .collect(Collectors.toList());
    }

    public List<SlotDto> getDoctorSlots(UUID doctorId, LocalDate fromDate) {
        return slotRepository.findByDoctorIdAndDateGreaterThanEqualOrderByDateAscStartTimeAsc(doctorId, fromDate)
                .stream()
                .map(s -> new SlotDto(s.getId(), s.getDate(), s.getStartTime(), s.getEndTime()))
                .collect(Collectors.toList());
    }

    public SlotDto addSlot(UUID doctorId, SlotRequest request) {
        User doctor = userRepository.findById(doctorId)
                .orElseThrow(() -> new ResourceNotFoundException("Doctor not found"));

        AvailableSlot slot = AvailableSlot.builder()
                .doctor(doctor)
                .date(request.getDate())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .build();

        slot = slotRepository.save(slot);
        return new SlotDto(slot.getId(), slot.getDate(), slot.getStartTime(), slot.getEndTime());
    }
    
    public void deleteSlot(UUID slotId, UUID doctorId) {
        AvailableSlot slot = slotRepository.findById(slotId)
            .orElseThrow(() -> new ResourceNotFoundException("Slot not found"));
            
        if (!slot.getDoctor().getId().equals(doctorId)) {
             throw new ResourceNotFoundException("Not authorized to delete this slot");
        }
        
        slotRepository.delete(slot);
    }
}
