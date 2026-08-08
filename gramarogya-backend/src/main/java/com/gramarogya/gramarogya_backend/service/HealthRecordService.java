package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.CreateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.dto.HealthRecordResponseDto;
import com.gramarogya.gramarogya_backend.dto.UpdateHealthRecordRequestDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface HealthRecordService {

    HealthRecordResponseDto createHealthRecord(
            Authentication authentication,
            CreateHealthRecordRequestDto requestDto
    );

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

    HealthRecordResponseDto updateHealthRecord(
            Authentication authentication,
            String id,
            UpdateHealthRecordRequestDto requestDto
    );

    void deleteHealthRecord(
            Authentication authentication,
            String id
    );
}

