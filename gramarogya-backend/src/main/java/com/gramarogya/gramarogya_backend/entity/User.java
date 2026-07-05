package com.gramarogya.gramarogya_backend.entity;

import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    private String name;

    private String email;

    private String password;

    private Role role;

    private String phone;

    private String village;

    private String taluka;

    private String district;

    private String state;
    private String profileImage;

}


