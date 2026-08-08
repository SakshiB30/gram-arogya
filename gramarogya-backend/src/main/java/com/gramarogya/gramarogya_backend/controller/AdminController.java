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
}