package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.CreateMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.MedicineResponseDto;
import com.gramarogya.gramarogya_backend.dto.RestockMedicineRequestDto;
import com.gramarogya.gramarogya_backend.dto.UpdateMedicineRequestDto;
import com.gramarogya.gramarogya_backend.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/inventory")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;


    @GetMapping
    public ResponseEntity<List<MedicineResponseDto>> getAllMedicines() {

        return ResponseEntity.ok(
                medicineService.getAllMedicines()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<MedicineResponseDto> getMedicineById(
            @PathVariable String id) {

        return ResponseEntity.ok(
                medicineService.getMedicineById(id)
        );
    }

    @PostMapping
    public ResponseEntity<MedicineResponseDto> addMedicine(
            @RequestBody CreateMedicineRequestDto request) {

        return new ResponseEntity<>(
                medicineService.addMedicine(request),
                HttpStatus.CREATED
        );
    }


    @PutMapping("/{id}")
    public ResponseEntity<MedicineResponseDto> updateMedicine(
            @PathVariable String id,
            @RequestBody UpdateMedicineRequestDto request) {

        return ResponseEntity.ok(
                medicineService.updateMedicine(id, request)
        );
    }

    @PatchMapping("/{id}/restock")
    public ResponseEntity<MedicineResponseDto> restockMedicine(
            @PathVariable String id,
            @RequestBody RestockMedicineRequestDto request) {

        return ResponseEntity.ok(
                medicineService.restockMedicine(id, request)
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMedicine(
            @PathVariable String id) {

        medicineService.deleteMedicine(id);

        return ResponseEntity.ok("Medicine deleted successfully.");
    }
}