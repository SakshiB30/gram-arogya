package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.UserResponseDto;
import com.gramarogya.gramarogya_backend.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/pending-anms")
    public List<UserResponseDto> getPendingAnms() {
        return adminService.getPendingAnms();
    }

    @PutMapping("/approve-anm/{id}")
    public UserResponseDto approveAnm(
            @PathVariable String id
    ) {
        return adminService.approveAnm(id);
    }

    @PutMapping("/reject-anm/{id}")
    public UserResponseDto rejectAnm(
            @PathVariable String id
    ) {
        return adminService.rejectAnm(id);
    }

    @PutMapping("/block-anm/{id}")
    public UserResponseDto blockAnm(
            @PathVariable String id
    ) {
        return adminService.blockAnm(id);
    }

    @PutMapping("/unblock-anm/{id}")
    public UserResponseDto unblockAnm(
            @PathVariable String id
    ) {
        return adminService.unblockAnm(id);
    }

    @GetMapping("/all-anms")
    public List<UserResponseDto> getAllAnms() {
        return adminService.getAllAnms();
    }

    @GetMapping("/all-ashas")
    public List<UserResponseDto> getAllAshas() {
        return adminService.getAllAshas();
    }

    @PutMapping("/block-asha/{id}")
    public UserResponseDto blockAsha(
            @PathVariable String id
    ) {
        return adminService.blockAsha(id);
    }

    @PutMapping("/unblock-asha/{id}")
    public UserResponseDto unblockAsha(
            @PathVariable String id
    ) {
        return adminService.unblockAsha(id);
    }

    @GetMapping("/users")
    public List<UserResponseDto> getAllUsers() {
        return adminService.getAllUsers();
    }
}