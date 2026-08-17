package com.gramarogya.gramarogya_backend.controller;

import com.gramarogya.gramarogya_backend.dto.BeneficiaryReportDto;
import com.gramarogya.gramarogya_backend.dto.Health_Records.HealthRecordReportDto;
import com.gramarogya.gramarogya_backend.dto.medicine.InventoryReportDto;
import com.gramarogya.gramarogya_backend.dto.report.ReportSummaryDto;
import com.gramarogya.gramarogya_backend.dto.visit.VisitReportDto;
import com.gramarogya.gramarogya_backend.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;


    // =====================================================
    // SUMMARY
    // =====================================================

    @GetMapping("/summary")
    public ResponseEntity<ReportSummaryDto> getSummary(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                reportService.getSummary(authentication)
        );
    }


    // =====================================================
    // BENEFICIARIES
    // =====================================================

    @GetMapping("/beneficiaries")
    public ResponseEntity<List<BeneficiaryReportDto>>
    getBeneficiaryReport(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                reportService.getBeneficiaryReport(authentication)
        );
    }


    // =====================================================
    // VISITS
    // =====================================================

    @GetMapping("/visits")
    public ResponseEntity<List<VisitReportDto>>
    getVisitReport(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                reportService.getVisitReport(authentication)
        );
    }


    // =====================================================
    // INVENTORY
    // =====================================================

    @GetMapping("/inventory")
    public ResponseEntity<List<InventoryReportDto>>
    getInventoryReport(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                reportService.getInventoryReport(authentication)
        );
    }


    // =====================================================
    // HEALTH RECORDS
    // =====================================================

    @GetMapping("/health-records")
    public ResponseEntity<List<HealthRecordReportDto>>
    getHealthRecordReport(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                reportService.getHealthRecordReport(authentication)
        );
    }


    // =====================================================
    // LOW STOCK
    // =====================================================

    @GetMapping("/inventory/low-stock")
    public ResponseEntity<List<InventoryReportDto>>
    getLowStockReport(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                reportService.getLowStockReport(authentication)
        );
    }


    // =====================================================
    // OUT OF STOCK
    // =====================================================

    @GetMapping("/inventory/out-of-stock")
    public ResponseEntity<List<InventoryReportDto>>
    getOutOfStockReport(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                reportService.getOutOfStockReport(authentication)
        );
    }
}