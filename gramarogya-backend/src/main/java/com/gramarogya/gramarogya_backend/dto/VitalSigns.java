package com.gramarogya.gramarogya_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VitalSigns {

    // Blood pressure
    // Example: "120/80"
    private String bloodPressure;

    // Weight in kilograms
    private Double weight;

    // Temperature in Celsius
    private Double temperature;

    // Hemoglobin in g/dL
    private Double hemoglobin;

    // Pulse rate in beats per minute
    private Integer pulseRate;

    // Respiratory rate per minute
    private Integer respiratoryRate;

    // Oxygen saturation percentage
    private Integer oxygenSaturation;
}