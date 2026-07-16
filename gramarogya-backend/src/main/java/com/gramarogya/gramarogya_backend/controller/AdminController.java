package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.CreateAnmRequestDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import com.gramarogya.gramarogya_backend.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @PostMapping("/create-anm")
    public UserResponseDto createAnm(@RequestBody CreateAnmRequestDto request) {
        return adminService.createAnm(request);
    }

}