package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.PatientRequestDto;
import com.gramarogya.gramarogya_backend.dto.PatientResponseDto;
import jakarta.validation.Valid;

import java.util.List;


public interface PatientService {

    PatientResponseDto createPatient(@Valid PatientRequestDto patientRequestDto);


    List<PatientResponseDto> getAllPatients();

    PatientResponseDto getPatientById(String id);

    PatientResponseDto updatePatient(String id, PatientRequestDto patientRequestDto);

    void deletePatient(String id);
}
