package com.gramarogya.gramarogya_backend.dto.dashboard;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpcomingVisitDto {

    private String id;

    private String beneficiaryName;

    private String visitType;

    private String nextVisitDate;
}