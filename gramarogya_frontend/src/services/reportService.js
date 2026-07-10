import axiosClient from "../api/axiosClient";

// ======================
// REPORT SUMMARY
// ======================

const fetchSummary = async () => {
  const response = await axiosClient.get("/reports/summary");
  return response.data;
};

// ======================
// BENEFICIARY REPORT
// ======================

const fetchBeneficiaryReport = async () => {
  const response = await axiosClient.get("/reports/beneficiaries");
  return response.data;
};

const reportService = {
  fetchSummary,
  fetchBeneficiaryReport,
};

export default reportService;