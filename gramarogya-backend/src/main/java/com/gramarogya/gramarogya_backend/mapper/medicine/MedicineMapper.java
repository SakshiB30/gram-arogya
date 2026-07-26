package com.gramarogya.gramarogya_backend.mapper.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.CreateMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.medicine.MedicineResponseDto;
import com.gramarogya.gramarogya_backend.dto.medicine.UpdateMedicineRequestDto;
import com.gramarogya.gramarogya_backend.entity.medicine.Medicine;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class MedicineMapper {

    // Create DTO -> Entity
    public Medicine toEntity(CreateMedicineRequestDto dto) {

        return Medicine.builder()
                .name(dto.getName())
                .type(dto.getType())
                .batch(dto.getBatch())
                .stock(dto.getStock())
                .minimumStock(dto.getMinimumStock())
                .expiryDate(dto.getExpiryDate())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
    }

    // Entity -> Response DTO
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

    // Update existing entity
    public void updateEntity(UpdateMedicineRequestDto dto,
                             Medicine medicine) {

        medicine.setName(dto.getName());
        medicine.setType(dto.getType());
        medicine.setBatch(dto.getBatch());
        medicine.setStock(dto.getStock());
        medicine.setMinimumStock(dto.getMinimumStock());
        medicine.setExpiryDate(dto.getExpiryDate());

        // Do NOT update status here.
        // Status is calculated in the service.

        medicine.setUpdatedAt(LocalDateTime.now());
    }
}