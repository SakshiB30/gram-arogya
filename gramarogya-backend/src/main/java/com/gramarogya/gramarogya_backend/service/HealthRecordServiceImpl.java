package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.CreateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.dto.HealthRecordResponseDto;
import com.gramarogya.gramarogya_backend.dto.UpdateHealthRecordRequestDto;
import com.gramarogya.gramarogya_backend.entity.Beneficiary;
import com.gramarogya.gramarogya_backend.entity.HealthRecord;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.exception.ResourceNotFoundException;
import com.gramarogya.gramarogya_backend.mapper.HealthRecordMapper;
import com.gramarogya.gramarogya_backend.repository.BeneficiaryRepository;
import com.gramarogya.gramarogya_backend.repository.HealthRecordRepository;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class HealthRecordServiceImpl implements HealthRecordService {

    private final HealthRecordRepository healthRecordRepository;
    private final BeneficiaryRepository beneficiaryRepository;
    private final VisitRepository visitRepository;
    private final HealthRecordMapper healthRecordMapper;

    @Override
    public HealthRecordResponseDto createHealthRecord(
            CreateHealthRecordRequestDto requestDto) {

        Beneficiary beneficiary = beneficiaryRepository
                .findById(requestDto.getBeneficiaryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Beneficiary not found"));

        Visit visit = visitRepository
                .findById(requestDto.getVisitId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Visit not found"));

        // Validate that the visit belongs to the beneficiary
        if (!visit.getBeneficiaryId().equals(beneficiary.getId())) {
            throw new IllegalArgumentException(
                    "Selected visit does not belong to the selected beneficiary."
            );
        }

        HealthRecord healthRecord = healthRecordMapper.toEntity(requestDto);

        healthRecord.setCreatedAt(LocalDateTime.now());
        healthRecord.setUpdatedAt(LocalDateTime.now());

        HealthRecord saved = healthRecordRepository.save(healthRecord);

        return mapToResponse(saved);
    }

    @Override
    public List<HealthRecordResponseDto> getAllHealthRecords() {

        return healthRecordRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public HealthRecordResponseDto getHealthRecordById(String id) {

        HealthRecord healthRecord =
                healthRecordRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Health Record not found with id: " + id
                                ));

        return mapToResponse(healthRecord);
    }

    @Override
    public List<HealthRecordResponseDto> getHealthRecordsByBeneficiaryId(
            String beneficiaryId) {

        return healthRecordRepository
                .findByBeneficiaryId(beneficiaryId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<HealthRecordResponseDto> getHealthRecordsByVisitId(
            String visitId) {

        return healthRecordRepository
                .findByVisitId(visitId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public HealthRecordResponseDto updateHealthRecord(
            String id,
            UpdateHealthRecordRequestDto requestDto) {

        HealthRecord healthRecord = healthRecordRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Health Record not found with id: " + id
                        ));

        Beneficiary beneficiary = beneficiaryRepository
                .findById(requestDto.getBeneficiaryId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Beneficiary not found"));

        Visit visit = visitRepository
                .findById(requestDto.getVisitId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Visit not found"));

        // Validate that the visit belongs to the beneficiary
        if (!visit.getBeneficiaryId().equals(beneficiary.getId())) {
            throw new IllegalArgumentException(
                    "Selected visit does not belong to the selected beneficiary."
            );
        }

        healthRecordMapper.updateEntity(requestDto, healthRecord);
        healthRecord.setUpdatedAt(LocalDateTime.now());

        HealthRecord updated = healthRecordRepository.save(healthRecord);

        return mapToResponse(updated);
    }

    @Override
    public void deleteHealthRecord(String id) {

        HealthRecord healthRecord =
                healthRecordRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Health Record not found with id: " + id
                                ));

        healthRecordRepository.delete(healthRecord);
    }

    private HealthRecordResponseDto mapToResponse(
            HealthRecord healthRecord) {

        Beneficiary beneficiary = beneficiaryRepository
                .findById(healthRecord.getBeneficiaryId())
                .orElse(null);

        Visit visit = visitRepository
                .findById(healthRecord.getVisitId())
                .orElse(null);

        return healthRecordMapper.toResponseDto(
                healthRecord,
                beneficiary,
                visit
        );
    }
}