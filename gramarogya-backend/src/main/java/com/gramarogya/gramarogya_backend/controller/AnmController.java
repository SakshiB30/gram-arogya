package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.AnmDashboardDto;
import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import com.gramarogya.gramarogya_backend.service.AnmService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/anm")
@RequiredArgsConstructor
public class AnmController {

    private final AnmService anmService;

    @GetMapping("/pending-ashas")
    public List<UserResponseDto> getPendingAshas(
            Authentication authentication) {

        return anmService.getPendingAshas(authentication);
    }

    @GetMapping("/all-ashas")
    public List<UserResponseDto> getAllAshas(
            Authentication authentication) {

        return anmService.getAllAshas(authentication);
    }

    @PutMapping("/approve-asha/{ashaId}")
    public UserResponseDto approveAsha(
            @PathVariable String ashaId,
            Authentication authentication) {

        return anmService.approveAsha(ashaId, authentication);
    }

    @PutMapping("/reject-asha/{ashaId}")
    public UserResponseDto rejectAsha(
            @PathVariable String ashaId,
            Authentication authentication) {

        return anmService.rejectAsha(ashaId, authentication);
    }

    @PutMapping("/block-asha/{ashaId}")
    public UserResponseDto blockAsha(
            @PathVariable String ashaId,
            Authentication authentication) {

        return anmService.blockAsha(ashaId, authentication);
    }

    @PutMapping("/unblock-asha/{ashaId}")
    public UserResponseDto unblockAsha(
            @PathVariable String ashaId,
            Authentication authentication) {

        return anmService.unblockAsha(ashaId, authentication);
    }

    @GetMapping("/dashboard")
    public AnmDashboardDto getDashboard(
            Authentication authentication) {

        return anmService.getDashboard(authentication);
    }
}