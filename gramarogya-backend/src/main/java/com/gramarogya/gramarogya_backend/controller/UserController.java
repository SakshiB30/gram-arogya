package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.UpdateProfileRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserProfileDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import com.gramarogya.gramarogya_backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getProfile(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                userService.getCurrentUser(email)
        );
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponseDto> updateProfile(
            Authentication authentication,
            @Valid @RequestBody UpdateProfileRequestDto request) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                userService.updateProfile(email, request)
        );
    }

    @GetMapping("/profile")
    public UserProfileDto profile(Authentication authentication){
        return userService.getProfile(authentication);
    }
}