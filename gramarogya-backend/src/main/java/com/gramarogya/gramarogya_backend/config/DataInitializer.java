package com.gramarogya.gramarogya_backend.config;

import com.gramarogya.gramarogya_backend.dto.AccountStatus;
import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.dto.VerificationStatus;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {

        if (userRepository.findFirstByRole(Role.ADMIN).isEmpty()) {

            User admin = User.builder()
                    .name("System Admin")
                    .email("admin@gmail.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)

                    .verificationStatus(
                            VerificationStatus.APPROVED)

                    .accountStatus(
                            AccountStatus.ACTIVE)

                    .build();

            userRepository.save(admin);

            System.out.println("=================================");
            System.out.println("Default Admin Created");
            System.out.println("Email : admin@gmail.com");
            System.out.println("Password : admin123");
            System.out.println("=================================");
        }
    }
}