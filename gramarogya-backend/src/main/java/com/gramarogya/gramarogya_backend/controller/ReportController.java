package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.BeneficiaryReportDto;
import com.gramarogya.gramarogya_backend.dto.HealthRecordReportDto;
import com.gramarogya.gramarogya_backend.dto.medicine.InventoryReportDto;
import com.gramarogya.gramarogya_backend.dto.ReportSummaryDto;
import com.gramarogya.gramarogya_backend.dto.VisitReportDto;
import com.gramarogya.gramarogya_backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;

    // =========================
    // Dashboard Summary
    // =========================
    @GetMapping("/summary")
    public ResponseEntity<ReportSummaryDto> getSummary() {
        return ResponseEntity.ok(reportService.getSummary());
    }

    // =========================
    // Beneficiary Report
    // =========================
    @GetMapping("/beneficiaries")
    public ResponseEntity<List<BeneficiaryReportDto>> getBeneficiaryReport() {
        return ResponseEntity.ok(reportService.getBeneficiaryReport());
    }

    // =========================
    // Visit Report
    // =========================
    @GetMapping("/visits")
    public ResponseEntity<List<VisitReportDto>> getVisitReport() {
        return ResponseEntity.ok(reportService.getVisitReport());
    }

    // =========================
    // Inventory Report
    // =========================
    @GetMapping("/inventory")
    public ResponseEntity<List<InventoryReportDto>> getInventoryReport() {
        return ResponseEntity.ok(reportService.getInventoryReport());
    }

    // =========================
    // Health Record Report
    // =========================
    @GetMapping("/health-records")
    public ResponseEntity<List<HealthRecordReportDto>> getHealthRecordReport() {
        return ResponseEntity.ok(reportService.getHealthRecordReport());
    }

    // =========================
    // Low Stock Report
    // =========================
    @GetMapping("/inventory/low-stock")
    public ResponseEntity<List<InventoryReportDto>> getLowStockReport() {
        return ResponseEntity.ok(reportService.getLowStockReport());
    }

    // =========================
    // Out Of Stock Report
    // =========================
    @GetMapping("/inventory/out-of-stock")
    public ResponseEntity<List<InventoryReportDto>> getOutOfStockReport() {
        return ResponseEntity.ok(reportService.getOutOfStockReport());
    }
}