package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.AshaRegisterRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import com.gramarogya.gramarogya_backend.service.AshaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/asha")
@RequiredArgsConstructor
public class AshaController {

    private final AshaService ashaService;

    @PostMapping("/register")
    public UserResponseDto register(
            @RequestBody AshaRegisterRequestDto request
    ) {
        return ashaService.register(request);
    }
}