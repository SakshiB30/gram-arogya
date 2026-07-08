package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.CreateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.dto.HealthRecordResponseDto;
import com.gramarogya.gramarogya_backend.dto.UpdateHealthRecordRequestDto;

import java.util.List;

public interface HealthRecordService {
    HealthRecordResponseDto createHealthRecord(
            CreateHealthRecordRequestDto requestDto);

    List<HealthRecordResponseDto> getAllHealthRecords();

    HealthRecordResponseDto getHealthRecordById(String id);

    List<HealthRecordResponseDto> getHealthRecordsByBeneficiaryId(
            String beneficiaryId);

    List<HealthRecordResponseDto> getHealthRecordsByVisitId(
            String visitId);

    HealthRecordResponseDto updateHealthRecord(
            String id,
            UpdateHealthRecordRequestDto requestDto);

    void deleteHealthRecord(String id);
}
