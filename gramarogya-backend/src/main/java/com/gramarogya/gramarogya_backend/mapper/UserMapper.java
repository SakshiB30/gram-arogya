package com.gramarogya.gramarogya_backend.mapper;

import com.gramarogya.gramarogya_backend.dto.RegisterRequestDto;
import com.gramarogya.gramarogya_backend.dto.UpdateProfileRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import com.gramarogya.gramarogya_backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(RegisterRequestDto dto) {
        return User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(dto.getPassword())
                .role(dto.getRole())
                .build();
    }

    public UserResponseDto toResponseDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .verificationStatus(user.getVerificationStatus())
                .accountStatus(user.getAccountStatus())
                .employeeId(user.getEmployeeId())
                .supervisorId(user.getSupervisorId())
                .phone(user.getPhone())
                .village(user.getVillage())
                .taluka(user.getTaluka())
                .district(user.getDistrict())
                .state(user.getState())
                .profileImage(user.getProfileImage())
                .build();
    }

    public void updateEntity(UpdateProfileRequestDto dto, User user) {
        user.setName(dto.getName());
        user.setPhone(dto.getPhone());
        user.setVillage(dto.getVillage());
        user.setTaluka(dto.getTaluka());
        user.setDistrict(dto.getDistrict());
        user.setState(dto.getState());
        user.setProfileImage(dto.getProfileImage());
    }
}