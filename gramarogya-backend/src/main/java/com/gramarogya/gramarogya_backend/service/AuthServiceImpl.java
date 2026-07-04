package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.LoginRequestDto;
import com.gramarogya.gramarogya_backend.dto.LoginResponseDto;
import com.gramarogya.gramarogya_backend.dto.RegisterRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import com.gramarogya.gramarogya_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Override
    public UserResponseDto register(RegisterRequestDto registerRequestDto) {

        User user = registerRequestDto.toEntity();

        user.setPassword(
                passwordEncoder.encode(registerRequestDto.getPassword())
        );

        user = userRepository.save(user);

        return user.toDto();
    }

    @Override
    public LoginResponseDto login(LoginRequestDto request){

        User user = userRepository.findByEmail(request.getEmail())

                .orElseThrow(()->
                        new RuntimeException("Invalid email"));

        if(!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword()
        )){

            throw new RuntimeException("Invalid password");

        }

        String token = jwtService.generateToken(user);

        return LoginResponseDto.builder()
                .token(token)
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}