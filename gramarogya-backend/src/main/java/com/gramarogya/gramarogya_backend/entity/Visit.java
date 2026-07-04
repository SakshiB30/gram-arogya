package com.gramarogya.gramarogya_backend.entity;


import com.gramarogya.gramarogya_backend.dto.VisitResponseDto;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "visits")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Visit {
    @Id
    private String id;

    private String patientId;

    private LocalDate visitDate;

    private String symptoms;

    private String diagnosis;

    private String medicine;

    private String notes;

    public VisitResponseDto toDTO(){
        return new VisitResponseDto(this.id, this.patientId, this.visitDate, this.symptoms, this.diagnosis, this.medicine, this.notes);
    }
}
