package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.CreateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.dto.HealthRecordResponseDto;
import com.gramarogya.gramarogya_backend.dto.UpdateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.service.HealthRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/health-records")
@RequiredArgsConstructor
public class HealthRecordController {

    private final HealthRecordService healthRecordService;

    // Create
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public HealthRecordResponseDto createHealthRecord(
            @Valid @RequestBody CreateHealthRecordRequestDto requestDto) {

        return healthRecordService.createHealthRecord(requestDto);
    }

    // Get All
    @GetMapping
    public List<HealthRecordResponseDto> getAllHealthRecords() {

        return healthRecordService.getAllHealthRecords();
    }

    // Get By ID
    @GetMapping("/{id}")
    public HealthRecordResponseDto getHealthRecordById(
            @PathVariable String id) {

        return healthRecordService.getHealthRecordById(id);
    }

    // Get By Beneficiary
    @GetMapping("/beneficiary/{beneficiaryId}")
    public List<HealthRecordResponseDto> getHealthRecordsByBeneficiaryId(
            @PathVariable String beneficiaryId) {

        return healthRecordService
                .getHealthRecordsByBeneficiaryId(beneficiaryId);
    }

    // Get By Visit
    @GetMapping("/visit/{visitId}")
    public List<HealthRecordResponseDto> getHealthRecordsByVisitId(
            @PathVariable String visitId) {

        return healthRecordService
                .getHealthRecordsByVisitId(visitId);
    }

    // Update
    @PutMapping("/{id}")
    public HealthRecordResponseDto updateHealthRecord(
            @PathVariable String id,
            @Valid @RequestBody UpdateHealthRecordRequestDto requestDto) {

        return healthRecordService.updateHealthRecord(id, requestDto);
    }

    // Delete
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteHealthRecord(@PathVariable String id) {

        healthRecordService.deleteHealthRecord(id);
    }
}