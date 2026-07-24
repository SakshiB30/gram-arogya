package com.gramarogya.gramarogya_backend.mapper;

import com.gramarogya.gramarogya_backend.dto.medicine.CreateMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineResponseDto;
import com.gramarogya.gramarogya_backend.dto.medicine.UpdateMedicineRequestDto;
import com.gramarogya.gramarogya_backend.entity.Medicine;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MedicineMapper {

    public Medicine toEntity(CreateMedicineRequestDto dto) {

        return Medicine.builder()
                .name(dto.getName())
                .type(dto.getType())
                .batch(dto.getBatch())
                .stock(dto.getStock())
                .expiryDate(dto.getExpiryDate())
                .status(dto.getStatus())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    public MedicineResponseDto toResponseDto(Medicine medicine) {

        return MedicineResponseDto.builder()
                .id(medicine.getId())
                .name(medicine.getName())
                .type(medicine.getType())
                .batch(medicine.getBatch())
                .stock(medicine.getStock())
                .expiryDate(medicine.getExpiryDate())
                .status(medicine.getStatus())
                .build();
    }

    public void updateEntity(
            UpdateMedicineRequestDto dto,
            Medicine medicine
    ) {

        medicine.setName(dto.getName());
        medicine.setType(dto.getType());
        medicine.setBatch(dto.getBatch());
        medicine.setStock(dto.getStock());
        medicine.setExpiryDate(dto.getExpiryDate());
        medicine.setStatus(dto.getStatus());
        medicine.setUpdatedAt(LocalDateTime.now());
    }
}