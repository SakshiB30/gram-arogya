package com.gramarogya.gramarogya_backend.service;

import com.gramarogya.gramarogya_backend.dto.BeneficiaryReportDto;
import com.gramarogya.gramarogya_backend.dto.HealthRecordReportDto;
import com.gramarogya.gramarogya_backend.dto.InventoryReportDto;
import com.gramarogya.gramarogya_backend.dto.ReportSummaryDto;
import com.gramarogya.gramarogya_backend.dto.VisitReportDto;

import java.util.List;

public interface ReportService {

    // Dashboard Summary
    ReportSummaryDto getSummary();

    // Beneficiary Report
    List<BeneficiaryReportDto> getBeneficiaryReport();

    // Visit Report
    List<VisitReportDto> getVisitReport();

    // Inventory Report
    List<InventoryReportDto> getInventoryReport();

    // Health Record Report
    List<HealthRecordReportDto> getHealthRecordReport();

    // Low Stock Medicines
    List<InventoryReportDto> getLowStockReport();

    // Out of Stock Medicines
    List<InventoryReportDto> getOutOfStockReport();
}