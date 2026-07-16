package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.AccountStatus;
import com.gramarogya.gramarogya_backend.dto.CreateAnmRequestDto;
import com.gramarogya.gramarogya_backend.dto.Role;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import com.gramarogya.gramarogya_backend.dto.VerificationStatus;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.mapper.UserMapper;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final UserMapper userMapper;

    private String generateAnmEmployeeId() {

        Optional<User> lastAnm =
                userRepository.findTopByRoleOrderByEmployeeIdDesc(Role.ANM);

        if (lastAnm.isEmpty()) {
            return "ANM001";
        }

        String lastId = lastAnm.get().getEmployeeId();

        int number = Integer.parseInt(lastId.substring(3));

        number++;

        return String.format("ANM%03d", number);
    }

    @Override
    public UserResponseDto createAnm(CreateAnmRequestDto request) {

        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create ANM
        User anm = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.ANM)
                .employeeId(generateAnmEmployeeId())

                // Admin-created ANMs are immediately usable
                .verificationStatus(VerificationStatus.APPROVED)
                .accountStatus(AccountStatus.ACTIVE)

                .build();

        // Save
        anm = userRepository.save(anm);

        return userMapper.toResponseDto(anm);
    }
}