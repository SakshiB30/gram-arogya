package com.gramarogya.gramarogya_backend.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "password_reset_otps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetOtp {

    @Id
    private String id;

    private String userId;

    private String email;

    private String otpHash;

    private LocalDateTime expiresAt;

    private int attempts;

    private boolean verified;
}