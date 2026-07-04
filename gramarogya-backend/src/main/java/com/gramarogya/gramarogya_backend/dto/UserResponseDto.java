package com.gramarogya.gramarogya_backend.dto;

import com.gramarogya.gramarogya_backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponseDto {
    private String id;
    private String name;
    private String email;
    private Role role;
    private String phone;
    private String village;
    private String district;
    private String state;
    private String profileImage;
}
