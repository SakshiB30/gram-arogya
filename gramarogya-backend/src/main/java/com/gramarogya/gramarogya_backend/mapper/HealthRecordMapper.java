package com.gramarogya.gramarogya_backend.mapper;

import com.gramarogya.gramarogya_backend.dto.Health_Records.CreateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.dto.Health_Records.HealthRecordResponseDto;
import com.gramarogya.gramarogya_backend.dto.Health_Records.UpdateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.HealthRecord;
import com.gramarogya.gramarogya_backend.entity.Visit;
import org.springframework.stereotype.Component;

@Component
public class HealthRecordMapper {

    // =====================================================
    // CREATE DTO -> ENTITY
    // =====================================================

    public HealthRecord toEntity(
            CreateHealthRecordRequestDto dto
    ) {

        return HealthRecord.builder()

                // -----------------------------------------
                // References
                // -----------------------------------------

                .beneficiaryId(dto.getBeneficiaryId())
                .visitId(dto.getVisitId())

                // -----------------------------------------
                // Clinical Assessment Time
                // -----------------------------------------

                .recordedAt(dto.getRecordedAt())

                // -----------------------------------------
                // Vital Signs
                // -----------------------------------------

                .bloodPressure(dto.getBloodPressure())
                .weight(dto.getWeight())
                .temperature(dto.getTemperature())
                .hemoglobin(dto.getHemoglobin())

                // -----------------------------------------
                // Medical Information
                // -----------------------------------------

                .diagnosis(dto.getDiagnosis())
                .prescription(dto.getPrescription())
                .notes(dto.getNotes())

                .build();
    }


    // =====================================================
    // ENTITY -> RESPONSE DTO
    // =====================================================

    public HealthRecordResponseDto toResponseDto(
            HealthRecord healthRecord,
            Beneficiary beneficiary,
            Visit visit
    ) {

        return HealthRecordResponseDto.builder()

                .id(healthRecord.getId())

                .beneficiaryId(
                        healthRecord.getBeneficiaryId()
                )

                .beneficiaryName(
                        beneficiary != null
                                ? beneficiary.getName()
                                : null
                )

                .visitId(
                        healthRecord.getVisitId()
                )

                .visitType(
                        visit != null
                                ? visit.getVisitType()
                                : null
                )

                .recordedBy(
                        healthRecord.getRecordedBy()
                )

                // -----------------------------------------
                // Clinical Assessment Time
                // -----------------------------------------

                .recordedAt(
                        healthRecord.getRecordedAt()
                )

                .bloodPressure(
                        healthRecord.getBloodPressure()
                )

                .weight(
                        healthRecord.getWeight()
                )

                .temperature(
                        healthRecord.getTemperature()
                )

                .hemoglobin(
                        healthRecord.getHemoglobin()
                )

                .diagnosis(
                        healthRecord.getDiagnosis()
                )

                .prescription(
                        healthRecord.getPrescription()
                )

                .notes(
                        healthRecord.getNotes()
                )

                .createdAt(
                        healthRecord.getCreatedAt()
                )

                .updatedAt(
                        healthRecord.getUpdatedAt()
                )

                .build();
    }


    // =====================================================
    // UPDATE DTO -> EXISTING ENTITY
    // =====================================================

    public void updateEntity(
            UpdateHealthRecordRequestDto dto,
            HealthRecord healthRecord
    ) {

        // =================================================
        // DO NOT UPDATE
        // =================================================
        //
        // beneficiaryId
        // visitId
        // recordedBy
        // createdAt
        //
        // These represent the original context of
        // the health record.
        // =================================================


        // -----------------------------------------
        // Vital Signs
        // -----------------------------------------

        healthRecord.setBloodPressure(
                dto.getBloodPressure()
        );

        healthRecord.setWeight(
                dto.getWeight()
        );

        healthRecord.setTemperature(
                dto.getTemperature()
        );

        healthRecord.setHemoglobin(
                dto.getHemoglobin()
        );


        // -----------------------------------------
        // Medical Information
        // -----------------------------------------

        healthRecord.setDiagnosis(
                dto.getDiagnosis()
        );

        healthRecord.setPrescription(
                dto.getPrescription()
        );

        healthRecord.setNotes(
                dto.getNotes()
        );
    }
}