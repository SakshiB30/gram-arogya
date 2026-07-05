package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.UpdateProfileRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.mapper.UserMapper;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repository;
    private final UserMapper userMapper;

    private User getUserByEmail(String email) {
        return repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @Override
    public UserResponseDto getCurrentUser(String email) {

        User user = getUserByEmail(email);

        return userMapper.toResponseDto(user);
    }

    @Override
    public UserResponseDto updateProfile(String email,
                                         UpdateProfileRequestDto request) {

        User user = getUserByEmail(email);

        userMapper.updateEntity(request, user);

        repository.save(user);

        return userMapper.toResponseDto(user);
    }
}