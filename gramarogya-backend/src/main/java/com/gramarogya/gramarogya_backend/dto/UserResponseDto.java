package com.gramarogya.gramarogya_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserResponseDto {

    private String id;

    private String name;

    private String email;

    private Role role;

    // Verification status
    private VerificationStatus verificationStatus;

    // Account status
    private AccountStatus accountStatus;

    private String employeeId;

    // MongoDB ID of supervising ANM
    private String supervisorId;

    private String phone;

    private String village;

    private String taluka;

    private String district;

    private String state;

    private String profileImage;
}