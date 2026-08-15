package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.Health_Records.CreateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.dto.Health_Records.HealthRecordResponseDto;
import com.gramarogya.gramarogya_backend.dto.Health_Records.UpdateHealthRecordRequestDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface HealthRecordService {

    // =====================================================
    // CREATE
    // =====================================================

    HealthRecordResponseDto createHealthRecord(
            Authentication authentication,
            CreateHealthRecordRequestDto requestDto
    );


    // =====================================================
    // READ
    // =====================================================

    List<HealthRecordResponseDto> getAllHealthRecords(
            Authentication authentication
    );

    HealthRecordResponseDto getHealthRecordById(
            Authentication authentication,
            String id
    );

    List<HealthRecordResponseDto> getHealthRecordsByBeneficiaryId(
            Authentication authentication,
            String beneficiaryId
    );

    List<HealthRecordResponseDto> getHealthRecordsByVisitId(
            Authentication authentication,
            String visitId
    );


    // =====================================================
    // UPDATE
    // =====================================================

    HealthRecordResponseDto updateHealthRecord(
            Authentication authentication,
            String id,
            UpdateHealthRecordRequestDto requestDto
    );


    // =====================================================
    // DELETE
    // =====================================================

    void deleteHealthRecord(
            Authentication authentication,
            String id
    );
}