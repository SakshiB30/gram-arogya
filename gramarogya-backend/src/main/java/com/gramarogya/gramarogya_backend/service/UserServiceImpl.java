package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.UpdateProfileRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository repository;

    @Override
    public UserResponseDto getCurrentUser(String email) {

        User user = repository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        return user.toDto();
    }

    @Override
    public UserResponseDto updateProfile(String email,
                                         UpdateProfileRequestDto request) {

        User user = repository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setVillage(request.getVillage());
        user.setTaluka(request.getTaluka());
        user.setDistrict(request.getDistrict());
        user.setState(request.getState());

        repository.save(user);

        return user.toDto();
    }
}