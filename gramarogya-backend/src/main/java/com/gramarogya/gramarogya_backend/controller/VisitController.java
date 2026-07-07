package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.CreateVisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.UpdateVisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.VisitResponseDto;

import com.gramarogya.gramarogya_backend.service.VisitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/visits")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VisitController {

    private final VisitService visitService;

    // Create Visit
    @PostMapping
    public VisitResponseDto create(
            Authentication authentication,
            @Valid @RequestBody CreateVisitRequestDto dto) {

        return visitService.create(authentication, dto);
    }

    // Get All Visits of Logged-in ASHA
    @GetMapping
    public List<VisitResponseDto> getAll(Authentication authentication) {

        return visitService.getAll(authentication);
    }

    // Get Visit By Id
    @GetMapping("/{id}")
    public VisitResponseDto getById(
            Authentication authentication,
            @PathVariable String id) {

        return visitService.getById(authentication, id);
    }

    // Update Visit
    @PutMapping("/{id}")
    public VisitResponseDto update(
            Authentication authentication,
            @PathVariable String id,
            @Valid @RequestBody UpdateVisitRequestDto dto) {

        return visitService.update(authentication, id, dto);
    }

    // Delete Visit
    @DeleteMapping("/{id}")
    public void delete(
            Authentication authentication,
            @PathVariable String id) {

        visitService.delete(authentication, id);
    }
}