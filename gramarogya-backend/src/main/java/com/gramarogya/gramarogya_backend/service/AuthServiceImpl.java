package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.LoginRequestDto;
import com.gramarogya.gramarogya_backend.dto.LoginResponseDto;
import com.gramarogya.gramarogya_backend.dto.RegisterRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import com.gramarogya.gramarogya_backend.entity.User;
import com.gramarogya.gramarogya_backend.mapper.UserMapper;
import com.gramarogya.gramarogya_backend.repository.UserRepository;
import com.gramarogya.gramarogya_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {


    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final UserMapper userMapper;

    @Override
    public UserResponseDto register(RegisterRequestDto registerRequestDto) {

        User user = userMapper.toEntity(registerRequestDto);
        user.setPassword(
                passwordEncoder.encode(registerRequestDto.getPassword())
        );

        user = userRepository.save(user);

        return userMapper.toResponseDto(user);
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