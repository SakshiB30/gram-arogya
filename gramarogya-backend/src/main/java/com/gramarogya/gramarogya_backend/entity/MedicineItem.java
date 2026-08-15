package com.gramarogya.gramarogya_backend.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineItem {

    // Reference to medicine in inventory
    private String medicineId;

    // Medicine name for displaying historical records
    private String medicineName;

    // Example: "500 mg"
    private String dosage;

    // Example: "2 times a day"
    private String frequency;

    // Example: "3 days"
    private String duration;

    // Number of units issued/prescribed
    private Integer quantity;

    // Example: "After food"
    private String instructions;
}