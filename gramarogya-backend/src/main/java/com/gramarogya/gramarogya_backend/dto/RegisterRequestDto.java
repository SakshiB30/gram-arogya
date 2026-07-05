package com.gramarogya.gramarogya_backend.dto;

import com.gramarogya.gramarogya_backend.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDto {
    private String name;

    private String email;

    private String password;

    private Role role;

}
