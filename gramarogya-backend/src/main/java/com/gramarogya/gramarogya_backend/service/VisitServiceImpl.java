package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.VisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.VisitResponseDto;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.repository.PatientRepository;
import com.gramarogya.gramarogya_backend.repository.VisitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitServiceImpl implements VisitService {

    @Autowired
    private VisitRepository visitRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Override
    public VisitResponseDto addVisit(VisitRequestDto visitRequestDto) {

        if (!patientRepository.existsById(visitRequestDto.getPatientId())) {
            throw new RuntimeException("Patient not found");
        }

        Visit visit = visitRequestDto.toEntity();

        return visitRepository.save(visit).toDTO();
    }

    @Override
    public List<Visit> getAllVisits() {
        return visitRepository.findAll();
    }

    @Override
    public Visit getVisitById(String id) {
        return visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));
    }

    @Override
    public List<Visit> getVisitsByPatient(String patientId) {
        return visitRepository.findByPatientId(patientId);
    }

    @Override
    public VisitResponseDto updateVisit(String id, VisitRequestDto visitRequestDto) {


        Visit visit = visitRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Visit not found"));

        if (!patientRepository.existsById(visitRequestDto.getPatientId())) {
            throw new RuntimeException("Patient not found");
        }

        visit.setPatientId(visitRequestDto.getPatientId());
        visit.setVisitDate(visitRequestDto.getVisitDate());
        visit.setSymptoms(visitRequestDto.getSymptoms());
        visit.setDiagnosis(visitRequestDto.getDiagnosis());
        visit.setMedicine(visitRequestDto.getMedicine());
        visit.setNotes(visitRequestDto.getNotes());

        return visitRepository
                .save(visit)
                .toDTO();
    }

    @Override
    public void deleteVisit(String id) {
        visitRepository.deleteById(id);
    }
}

