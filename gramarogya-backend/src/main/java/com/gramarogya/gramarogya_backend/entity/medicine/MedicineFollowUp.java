package com.gramarogya.gramarogya_backend.entity.medicine;

import com.gramarogya.gramarogya_backend.dto.medicine.MedicineAdherence;
import com.gramarogya.gramarogya_backend.dto.medicine.SideEffectSeverity;
import com.gramarogya.gramarogya_backend.dto.medicine.SymptomStatus;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "medicine_followups")
public class MedicineFollowUp {

    @Id
    private String id;

    // Beneficiary being followed up
    private String beneficiaryId;

    // ASHA visit associated with this follow-up
    private String visitId;

    // Date of follow-up
    private LocalDate followUpDate;

    // Treatment adherence
    private MedicineAdherence medicineTaken;

    // Current health condition
    private SymptomStatus symptomStatus;

    // Severity of side effects
    private SideEffectSeverity sideEffects;

    // Details if side effects are present
    private String sideEffectDetails;

    // ASHA's observations
    private String remarks;

    // Whether PHC / doctor consultation is required
    private Boolean needsDoctorVisit;

    // Reason for referral
    private String referralReason;

    // Audit
    private String recordedBy;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
