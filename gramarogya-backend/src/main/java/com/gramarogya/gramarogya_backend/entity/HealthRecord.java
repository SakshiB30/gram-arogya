package com.gramarogya.gramarogya_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "health_records")
@CompoundIndexes({
        @CompoundIndex(
                name = "beneficiary_createdAt_idx",
                def = "{'beneficiaryId': 1, 'createdAt': -1}"
        ),
        @CompoundIndex(
                name = "visit_createdAt_idx",
                def = "{'visitId': 1, 'createdAt': -1}"
        ),
        @CompoundIndex(
                name = "recordedBy_createdAt_idx",
                def = "{'recordedBy': 1, 'createdAt': -1}"
        )
})
public class HealthRecord {

    // =====================================================
    // PRIMARY KEY
    // =====================================================

    @Id
    private String id;


    // =====================================================
    // BENEFICIARY
    // =====================================================

    /**
     * Beneficiary whose health was assessed.
     *
     * Immutable after creation.
     */
    private String beneficiaryId;


    // =====================================================
    // VISIT
    // =====================================================

    /**
     * Visit during which this health assessment
     * was performed.
     *
     * Immutable after creation.
     */
    @Indexed(unique = true)
    private String visitId;


    // =====================================================
    // RECORDED BY
    // =====================================================

    /**
     * ID of the user who recorded the health assessment.
     *
     * Usually ASHA / ANM.
     *
     * Immutable after creation.
     */
    private String recordedBy;


    // =====================================================
    // CLINICAL ASSESSMENT TIME
    // =====================================================

    /**
     * Actual date and time when the health assessment
     * was performed.
     */
    private LocalDateTime recordedAt;


    // =====================================================
    // VITAL SIGNS
    // =====================================================

    /**
     * Blood pressure.
     *
     * Example:
     * 120/80
     *
     * Unit: mmHg
     */
    private String bloodPressure;


    /**
     * Weight of beneficiary.
     *
     * Unit: kilograms.
     */
    private Double weight;


    /**
     * Body temperature.
     *
     * Unit: Celsius.
     */
    private Double temperature;


    /**
     * Hemoglobin level.
     *
     * Unit: g/dL.
     */
    private Double hemoglobin;


    // =====================================================
    // MEDICAL ASSESSMENT
    // =====================================================

    /**
     * Health condition or assessment recorded
     * during the visit.
     */
    private String diagnosis;


    /**
     * Prescription or medicine instructions.
     *
     * Kept as text for the current implementation.
     *
     * Structured medicine information will be handled
     * through the Medicine module.
     */
    private String prescription;


    /**
     * Additional observations or remarks.
     */
    private String notes;


    // =====================================================
    // MEDICINES
    // =====================================================

    /**
     * Medicines associated with this health record.
     *
     * This will later connect the Health Record module
     * with the Medicine Inventory module.
     */
    private List<MedicineItem> medicines;


    // =====================================================
    // AUDIT TIMESTAMPS
    // =====================================================

    /**
     * Date and time when the database record was created.
     */
    @CreatedDate
    private LocalDateTime createdAt;


    /**
     * Date and time when the database record was last modified.
     */
    @LastModifiedDate
    private LocalDateTime updatedAt;
}