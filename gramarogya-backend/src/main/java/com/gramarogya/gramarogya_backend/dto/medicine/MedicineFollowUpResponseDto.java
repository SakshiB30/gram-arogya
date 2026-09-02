package com.gramarogya.gramarogya_backend.dto.medicine;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicineFollowUpResponseDto {

    private String id;

    private String beneficiaryId;

    private String visitId;

    private LocalDate followUpDate;

    private MedicineAdherence medicineTaken;

    private SymptomStatus symptomStatus;

    private SideEffectSeverity sideEffects;

    private String sideEffectDetails;

    private String remarks;

    private Boolean needsDoctorVisit;

    private String referralReason;

    private String recordedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}