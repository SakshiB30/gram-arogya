package com.gramarogya.gramarogya_backend.entity;


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

    // Beneficiary for whom the visit is made
    private String beneficiaryId;

    // Logged-in ASHA worker who created the visit
    private String userId;

    // Automatically set when visit is created
    private LocalDate visitDate;

    // Example: Home Visit, Follow-up Visit, Immunization Visit
    private String visitType;

    // Example: Completed, Pending, Missed
    private String status;

    // Additional remarks
    private String notes;

    private LocalDate nextVisitDate;
}
