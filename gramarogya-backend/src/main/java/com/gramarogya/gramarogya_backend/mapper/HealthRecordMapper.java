package com.gramarogya.gramarogya_backend.mapper;

import com.gramarogya.gramarogya_backend.dto.CreateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.dto.HealthRecordResponseDto;
import com.gramarogya.gramarogya_backend.dto.UpdateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.HealthRecord;
import com.gramarogya.gramarogya_backend.entity.Visit;
import org.springframework.stereotype.Component;

@Component
public class HealthRecordMapper {

    // Create DTO -> Entity
    public HealthRecord toEntity(CreateHealthRecordRequestDto dto) {

        return HealthRecord.builder()
                .beneficiaryId(dto.getBeneficiaryId())
                .visitId(dto.getVisitId())
                .bloodPressure(dto.getBloodPressure())
                .weight(dto.getWeight())
                .temperature(dto.getTemperature())
                .hemoglobin(dto.getHemoglobin())
                .diagnosis(dto.getDiagnosis())
                .prescription(dto.getPrescription())
                .notes(dto.getNotes())
                .build();
    }

    // Entity -> Response DTO
    public HealthRecordResponseDto toResponseDto(
            HealthRecord healthRecord,
            Beneficiary beneficiary,
            Visit visit
    ) {

        return HealthRecordResponseDto.builder()
                .id(healthRecord.getId())

                // Beneficiary
                .beneficiaryId(healthRecord.getBeneficiaryId())
                .beneficiaryName(
                        beneficiary != null ? beneficiary.getName() : null
                )

                // Visit
                .visitId(healthRecord.getVisitId())
                .visitType(
                        visit != null ? visit.getVisitType() : null
                )

                // Vitals
                .bloodPressure(healthRecord.getBloodPressure())
                .weight(healthRecord.getWeight())
                .temperature(healthRecord.getTemperature())
                .hemoglobin(healthRecord.getHemoglobin())

                // Medical
                .diagnosis(healthRecord.getDiagnosis())
                .prescription(healthRecord.getPrescription())
                .notes(healthRecord.getNotes())

                // Dates
                .createdAt(healthRecord.getCreatedAt())
                .updatedAt(healthRecord.getUpdatedAt())

                .build();
    }

    // Update existing entity
    public void updateEntity(
            UpdateHealthRecordRequestDto dto,
            HealthRecord healthRecord
    ) {

        healthRecord.setBeneficiaryId(dto.getBeneficiaryId());
        healthRecord.setVisitId(dto.getVisitId());

        healthRecord.setBloodPressure(dto.getBloodPressure());
        healthRecord.setWeight(dto.getWeight());
        healthRecord.setTemperature(dto.getTemperature());
        healthRecord.setHemoglobin(dto.getHemoglobin());

        healthRecord.setDiagnosis(dto.getDiagnosis());
        healthRecord.setPrescription(dto.getPrescription());
        healthRecord.setNotes(dto.getNotes());
    }
}