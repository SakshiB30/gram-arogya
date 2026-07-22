package com.gramarogya.gramarogya_backend.entity;

import com.gramarogya.gramarogya_backend.dto.AccountStatus;
import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.dto.VerificationStatus;
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

    private VerificationStatus verificationStatus;

    private AccountStatus accountStatus;

    private String employeeId;

    private String supervisorId;

    private String phone;

    private String village;

    private String taluka;

    private String district;

    private String state;

    private String profileImage;
}


