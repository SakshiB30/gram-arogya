package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.*;
import com.gramarogya.gramarogya_backend.service.BeneficiaryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/beneficiaries")
@RequiredArgsConstructor
public class BeneficiaryController {

    private final BeneficiaryService beneficiaryService;

    @PostMapping
    public ResponseEntity<BeneficiaryResponseDto> create(
            Authentication authentication,
            @Valid @RequestBody CreateBeneficiaryRequestDto dto
    ) {
        return ResponseEntity.ok(
                beneficiaryService.create(authentication, dto)
        );
    }

    @GetMapping
    public ResponseEntity<List<BeneficiaryResponseDto>> getAll(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                beneficiaryService.getAll(authentication)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<BeneficiaryResponseDto> getById(
            Authentication authentication,
            @PathVariable String id
    ) {
        return ResponseEntity.ok(
                beneficiaryService.getById(authentication, id)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<BeneficiaryResponseDto> update(
            Authentication authentication,
            @PathVariable String id,
            @RequestBody UpdateBeneficiaryRequestDto dto
    ) {
        return ResponseEntity.ok(
                beneficiaryService.update(authentication, id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(
            Authentication authentication,
            @PathVariable String id
    ) {
        beneficiaryService.delete(authentication, id);
        return ResponseEntity.noContent().build();
    }
}