package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.PatientRequestDto;
import com.gramarogya.gramarogya_backend.dto.PatientResponseDto;
import com.gramarogya.gramarogya_backend.entity.Patient;
import com.gramarogya.gramarogya_backend.exception.PatientHasVisitException;
import com.gramarogya.gramarogya_backend.repository.PatientRepository;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PatientServiceImpl implements PatientService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private VisitRepository visitRepository;

    @Override
    public PatientResponseDto createPatient(PatientRequestDto patientRequestDto){

        Patient patient = patientRequestDto.toEntity();
        patient.setCreatedAt(LocalDateTime.now());

        return patientRepository
                .save(patient)
                .toDTO();
    }

    @Override
    public List<PatientResponseDto> getAllPatients() {

        return patientRepository.findAll()
                .stream()
                .map(Patient::toDTO)
                .toList();
    }

    @Override
    public PatientResponseDto getPatientById(String id) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        return patient.toDTO();
    }

    @Override
    public PatientResponseDto updatePatient(String id, PatientRequestDto patientRequestDto) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        patient.setName(patientRequestDto.getName());
        patient.setAge(patientRequestDto.getAge());
        patient.setGender(patientRequestDto.getGender());
        patient.setMobile(patientRequestDto.getMobile());
        patient.setVillage(patientRequestDto.getVillage());
        patient.setHealthCategory(patientRequestDto.getHealthCategory());

        return patientRepository
                .save(patient)
                .toDTO();
    }

    @Override
    public void deletePatient(String id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        if (visitRepository.existsByPatientId(id)) {
            throw new PatientHasVisitException(
                    "Cannot delete patient. Patient has visit records. Delete or archive visits first."
            );
        }

        patientRepository.delete(patient);
    }


}
