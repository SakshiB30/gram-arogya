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

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "health_records")
public class HealthRecord {

    @Id
    private String id;

    // References
    private String beneficiaryId;
    private String visitId;

    // Vital Signs
    private String bloodPressure;
    private Double weight;
    private Double temperature;
    private Double hemoglobin;

    // Medical Details
    private String diagnosis;
    private String prescription;
    private String notes;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}