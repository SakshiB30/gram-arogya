package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.VisitRequestDto;
import com.gramarogya.gramarogya_backend.dto.VisitResponseDto;
import com.gramarogya.gramarogya_backend.entity.Visit;
import com.gramarogya.gramarogya_backend.service.VisitService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/visits")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VisitController {

    private final VisitService visitService;

    // Create a new visit
    @PostMapping
    public VisitResponseDto addVisit(
            @Valid @RequestBody VisitRequestDto visitRequestDto) {

        return visitService.addVisit(visitRequestDto);
    }

    // Get all visits
    @GetMapping
    public List<Visit> getAllVisits() {
        return visitService.getAllVisits();
    }

    // Get visit by id
    @GetMapping("/{id}")
    public Visit getVisitById(@PathVariable String id) {
        return visitService.getVisitById(id);
    }

    // Get all visits of a patient
    @GetMapping("/patient/{patientId}")
    public List<Visit> getVisitsByPatient(@PathVariable String patientId) {
        return visitService.getVisitsByPatient(patientId);
    }

    @PutMapping("/{id}")
    public VisitResponseDto updateVisit(
            @PathVariable String id,
            @RequestBody VisitRequestDto visitRequestDto) {

        return visitService.updateVisit(id, visitRequestDto);
    }

    // Delete visit
    @DeleteMapping("/{id}")
    public String deleteVisit(@PathVariable String id) {
        visitService.deleteVisit(id);
        return "Visit deleted successfully";
    }
}