package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.*;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.mapper.UserMapper;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class AshaServiceImpl implements AshaService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    @Override
    public UserResponseDto register(AshaRegisterRequestDto request) {

        // Email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Find assigned ANM
        User anm = userRepository
                .findByEmployeeId(request.getAnmEmployeeId())
                .orElseThrow(() ->
                        new RuntimeException("Invalid ANM Employee ID"));

        // Ensure Employee ID belongs to ANM
        if (anm.getRole() != Role.ANM) {
            throw new RuntimeException("Invalid ANM Employee ID");
        }

        // Ensure ANM is active
        if (anm.getVerificationStatus() != VerificationStatus.APPROVED ||
                anm.getAccountStatus() != AccountStatus.ACTIVE) {

            throw new RuntimeException(
                    "Assigned ANM is not active.");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .village(request.getVillage())
                .taluka(request.getTaluka())
                .district(request.getDistrict())
                .state(request.getState())
                .role(Role.ASHA)
                .verificationStatus(VerificationStatus.PENDING)
                .accountStatus(AccountStatus.BLOCKED)
                .employeeId(null)
                .supervisorId(anm.getId())
                .build();

        user = userRepository.save(user);

        return userMapper.toResponseDto(user);
    }
}
