package com.gramarogya.gramarogya_backend.dto;

import com.gramarogya.gramarogya_backend.entity.Visit;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VisitRequestDto {
    @NotBlank(message = "Patient Id is required")
    private String patientId;

    private LocalDate visitDate;

    private String symptoms;

    private String diagnosis;

    private String medicine;

    private String notes;

    public Visit toEntity(){
        return new Visit(null, this.patientId, this.visitDate, this.symptoms, this.diagnosis, this.medicine, this.notes);
    }
}
