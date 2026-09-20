package com.gramarogya.gramarogya_backend.security;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Base64;

@Component
public class PasswordResetTokenGenerator {

    private final SecureRandom secureRandom = new SecureRandom();

    public String generateToken() {

        byte[] bytes = new byte[32];

        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }
}