package com.gramarogya.gramarogya_backend.repository;

import com.gramarogya.gramarogya_backend.entity.PasswordResetOtp;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface PasswordResetOtpRepository
        extends MongoRepository<PasswordResetOtp, String> {

    Optional<PasswordResetOtp> findByUserId(String userId);

    void deleteByUserId(String userId);
}