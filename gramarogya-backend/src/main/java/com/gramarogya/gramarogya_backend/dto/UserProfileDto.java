package com.gramarogya.gramarogya_backend.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserProfileDto {

    private String id;

    private String name;

    private String email;

    private Role role;

    private String phone;

    private String village;
}