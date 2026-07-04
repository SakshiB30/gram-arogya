package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.PatientRequestDto;
import com.gramarogya.gramarogya_backend.dto.PatientResponseDto;
import com.gramarogya.gramarogya_backend.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@Validated
@RequestMapping("/patients")
public class PatientController {

    @Autowired
    PatientService patientService;

    @PostMapping
    public ResponseEntity<PatientResponseDto> createPatient(@Valid @RequestBody PatientRequestDto patientRequestDto){
        PatientResponseDto response = patientService.createPatient(patientRequestDto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public List<PatientResponseDto> getAll() {
        return patientService.getAllPatients();
    }

    @GetMapping("/{id}")
    public PatientResponseDto getById(@PathVariable String id) {
        return patientService.getPatientById(id);
    }

    @PutMapping("/{id}")
    public PatientResponseDto updatePatient(
            @PathVariable String id,
            @RequestBody PatientRequestDto patientRequestDto) {

        return patientService.updatePatient(id, patientRequestDto);
    }

    @DeleteMapping("/{id}")
    public String deletePatient(@PathVariable String id) {

        patientService.deletePatient(id);

        return "Patient deleted successfully";
    }
}
