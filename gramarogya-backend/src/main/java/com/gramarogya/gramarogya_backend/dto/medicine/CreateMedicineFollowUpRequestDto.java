package com.gramarogya.gramarogya_backend.dto.medicine;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateMedicineFollowUpRequestDto {

    @NotBlank(message = "Beneficiary ID is required")
    private String beneficiaryId;

    @NotBlank(message = "Visit ID is required")
    private String visitId;

    @NotNull(message = "Medicine adherence is required")
    private MedicineAdherence medicineTaken;

    @NotNull(message = "Symptom status is required")
    private SymptomStatus symptomStatus;

    @NotNull(message = "Side effect severity is required")
    private SideEffectSeverity sideEffects;

    private String sideEffectDetails;

    private String remarks;

    @NotNull(message = "Doctor visit requirement must be specified")
    private Boolean needsDoctorVisit;

    private String referralReason;
}