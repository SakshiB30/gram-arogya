package com.gramarogya.gramarogya_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "health_records")
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
     * Immutable after record creation.
     */
    private String beneficiaryId;


    // =====================================================
    // VISIT
    // =====================================================

    /**
     * Visit during which this health record was created.
     *
     * Immutable after record creation.
     */
    private String visitId;


    // =====================================================
    // RECORDED BY
    // =====================================================

    /**
     * User who recorded the health record.
     *
     * Usually ASHA or ANM.
     */
    private String recordedBy;


    // =====================================================
    // CLINICAL ASSESSMENT TIME
    // =====================================================

    /**
     * Actual date/time when the health assessment
     * was recorded.
     */
    private LocalDateTime recordedAt;


    // =====================================================
    // VITAL SIGNS
    // =====================================================

    /**
     * Example:
     * 120/80
     *
     * Unit: mmHg
     */
    private String bloodPressure;


    /**
     * Weight in kilograms.
     */
    private Double weight;


    /**
     * Body temperature in Celsius.
     */
    private Double temperature;


    /**
     * Hemoglobin level.
     *
     * Unit: g/dL
     */
    private Double hemoglobin;


    // =====================================================
    // MEDICAL ASSESSMENT
    // =====================================================

    /**
     * Health condition / assessment identified
     * during the visit.
     */
    private String diagnosis;


    /**
     * Medicines/instructions prescribed during
     * the visit.
     *
     * Kept temporarily as text.
     * This can later be replaced/extended with
     * structured MedicineItem data.
     */
    private String prescription;


    /**
     * Additional observations made by ASHA/ANM.
     */
    private String notes;


    // =====================================================
    // MEDICINE ITEMS
    // =====================================================

    /**
     * Structured medicines associated with this
     * health record.
     *
     * This allows the Health Records module to
     * connect with the Medicine Inventory module.
     */
    private List<MedicineItem> medicines;


    // =====================================================
    // AUDIT TIMESTAMPS
    // =====================================================

    @CreatedDate
    private LocalDateTime createdAt;


    @LastModifiedDate
    private LocalDateTime updatedAt;
}