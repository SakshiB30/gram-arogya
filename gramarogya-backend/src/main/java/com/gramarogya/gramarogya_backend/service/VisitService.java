package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.VisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.VisitResponseDto;
import com.gramarogya.gramarogya_backend.entity.Visit;

import java.util.List;

public interface VisitService {

    VisitResponseDto addVisit(VisitRequestDto visitRequestDto);

    List<Visit> getAllVisits();

    Visit getVisitById(String id);

    List<Visit> getVisitsByPatient(String patientId);

    void deleteVisit(String id);

    VisitResponseDto updateVisit(String id, VisitRequestDto visitRequestDto);
}
