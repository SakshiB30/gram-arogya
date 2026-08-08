package com.gramarogya.gramarogya_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "activities")
public class Activity {

    @Id
    private String id;

    // User who performed the activity
    private String userId;

    // Role of the user
    // ASHA / ANM / ADMIN
    private String userRole;

    // Activity category
    // BENEFICIARY / VISIT / HEALTH_RECORD / MEDICINE / USER / PROJECT
    private String type;

    // Action performed
    // CREATE / UPDATE / DELETE / COMPLETE / VERIFY / ASSIGN
    private String action;

    // Activity heading
    // Example: "Beneficiary Added"
    private String title;

    // Activity details
    // Example: "Ramesh • Pune"
    private String description;

    // ID of the related record
    private String referenceId;

    // Type of related record
    // Beneficiary / Visit / HealthRecord / User / Project
    private String referenceType;

    // Date and time when activity happened
    private LocalDateTime createdAt;
}