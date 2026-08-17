package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.BeneficiaryReportDto;
import com.gramarogya.gramarogya_backend.dto.Health_Records.HealthRecordReportDto;
import com.gramarogya.gramarogya_backend.dto.medicine.InventoryReportDto;
import com.gramarogya.gramarogya_backend.dto.report.ReportSummaryDto;
import com.gramarogya.gramarogya_backend.dto.visit.VisitReportDto;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface ReportService {

    // =====================================================
    // DASHBOARD SUMMARY
    // =====================================================

    ReportSummaryDto getSummary(Authentication authentication);


    // =====================================================
    // BENEFICIARY REPORT
    // =====================================================

    List<BeneficiaryReportDto> getBeneficiaryReport(
            Authentication authentication
    );


    // =====================================================
    // VISIT REPORT
    // =====================================================

    List<VisitReportDto> getVisitReport(
            Authentication authentication
    );


    // =====================================================
    // INVENTORY REPORT
    // =====================================================

    List<InventoryReportDto> getInventoryReport(
            Authentication authentication
    );


    // =====================================================
    // HEALTH RECORD REPORT
    // =====================================================

    List<HealthRecordReportDto> getHealthRecordReport(
            Authentication authentication
    );


    // =====================================================
    // LOW STOCK
    // =====================================================

    List<InventoryReportDto> getLowStockReport(
            Authentication authentication
    );


    // =====================================================
    // OUT OF STOCK
    // =====================================================

    List<InventoryReportDto> getOutOfStockReport(
            Authentication authentication
    );
}