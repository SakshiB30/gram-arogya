package com.gramarogya.gramarogya_backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDto {

    private String id;
    private String title;
    private String description;
    private String time;
    private String type;
    private String action;
    private String referenceId;
    private String referenceType;
}
