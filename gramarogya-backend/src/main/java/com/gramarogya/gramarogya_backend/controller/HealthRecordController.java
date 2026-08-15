package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.Health_Records.CreateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.dto.Health_Records.HealthRecordResponseDto;
import com.gramarogya.gramarogya_backend.dto.Health_Records.UpdateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.service.HealthRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/health-records")
@RequiredArgsConstructor
public class HealthRecordController {

    private final HealthRecordService healthRecordService;


    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HealthRecordResponseDto createHealthRecord(
            Authentication authentication,
            @Valid @RequestBody CreateHealthRecordRequestDto requestDto) {

        return healthRecordService.createHealthRecord(
                authentication,
                requestDto
        );
    }


    // =====================================================
    // GET ALL
    // =====================================================

    @GetMapping
    public List<HealthRecordResponseDto> getAllHealthRecords(
            Authentication authentication) {

        return healthRecordService.getAllHealthRecords(
                authentication
        );
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public HealthRecordResponseDto getHealthRecordById(
            Authentication authentication,
            @PathVariable String id) {

        return healthRecordService.getHealthRecordById(
                authentication,
                id
        );
    }


    // =====================================================
    // GET BY BENEFICIARY
    // =====================================================

    @GetMapping("/beneficiary/{beneficiaryId}")
    public List<HealthRecordResponseDto>
    getHealthRecordsByBeneficiaryId(
            Authentication authentication,
            @PathVariable String beneficiaryId) {

        return healthRecordService
                .getHealthRecordsByBeneficiaryId(
                        authentication,
                        beneficiaryId
                );
    }


    // =====================================================
    // GET BY VISIT
    // =====================================================

    @GetMapping("/visit/{visitId}")
    public List<HealthRecordResponseDto>
    getHealthRecordsByVisitId(
            Authentication authentication,
            @PathVariable String visitId) {

        return healthRecordService
                .getHealthRecordsByVisitId(
                        authentication,
                        visitId
                );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}")
    public HealthRecordResponseDto updateHealthRecord(
            Authentication authentication,
            @PathVariable String id,
            @Valid @RequestBody UpdateHealthRecordRequestDto requestDto) {

        return healthRecordService.updateHealthRecord(
                authentication,
                id,
                requestDto
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteHealthRecord(
            Authentication authentication,
            @PathVariable String id) {

        healthRecordService.deleteHealthRecord(
                authentication,
                id
        );
    }
}

