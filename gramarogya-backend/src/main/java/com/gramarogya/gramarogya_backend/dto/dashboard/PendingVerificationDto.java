package com.gramarogya.gramarogya_backend.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PendingVerificationDto {

    private String id;

    private String name;

    private String role;

    private String employeeId;

    private String village;

    private String phone;

    private String status;
}