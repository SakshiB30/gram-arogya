import axiosClient from "../api/axiosClient";

// =====================================================
// REPORT SUMMARY
// =====================================================

const fetchSummary = async () => {
  const response = await axiosClient.get("/reports/summary");
  return response.data;
};


// =====================================================
// BENEFICIARY REPORT
// =====================================================

const fetchBeneficiaryReport = async () => {
  const response = await axiosClient.get("/reports/beneficiaries");
  return response.data;
};


// =====================================================
// VISIT REPORT
// =====================================================

const fetchVisitReport = async () => {
  const response = await axiosClient.get("/reports/visits");
  return response.data;
};


// =====================================================
// INVENTORY REPORT
// =====================================================

const fetchInventoryReport = async () => {
  const response = await axiosClient.get("/reports/inventory");
  return response.data;
};


// =====================================================
// HEALTH RECORD REPORT
// =====================================================

const fetchHealthRecordReport = async () => {
  const response = await axiosClient.get("/reports/health-records");
  return response.data;
};


// =====================================================
// LOW STOCK REPORT
// =====================================================

const fetchLowStockReport = async () => {
  const response = await axiosClient.get(
    "/reports/inventory/low-stock"
  );

  return response.data;
};


// =====================================================
// OUT OF STOCK REPORT
// =====================================================

const fetchOutOfStockReport = async () => {
  const response = await axiosClient.get(
    "/reports/inventory/out-of-stock"
  );

  return response.data;
};


// =====================================================
// EXPORT
// =====================================================

const reportService = {
  fetchSummary,
  fetchBeneficiaryReport,
  fetchVisitReport,
  fetchInventoryReport,
  fetchHealthRecordReport,
  fetchLowStockReport,
  fetchOutOfStockReport,
};

export default reportService;