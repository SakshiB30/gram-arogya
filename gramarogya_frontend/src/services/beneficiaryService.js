import axiosClient from "../api/axiosClient";

/**
 * Get all beneficiaries
 */
const getAllBeneficiaries = async () => {
  const response = await axiosClient.get("/beneficiaries");
  return response.data;
};

/**
 * Get beneficiary by ID
 */
const getBeneficiaryById = async (id) => {
  const response = await axiosClient.get(`/beneficiaries/${id}`);
  return response.data;
};

/**
 * Create beneficiary
 */
const createBeneficiary = async (beneficiaryData) => {
  const response = await axiosClient.post("/beneficiaries", beneficiaryData);
  return response.data;
};

/**
 * Update beneficiary
 */
const updateBeneficiary = async (id, beneficiaryData) => {
  const response = await axiosClient.put(
    `/beneficiaries/${id}`,
    beneficiaryData
  );
  return response.data;
};

/**
 * Delete beneficiary
 */
const deleteBeneficiary = async (id) => {
  const response = await axiosClient.delete(`/beneficiaries/${id}`);
  return response.data;
};

const beneficiaryService = {
  getAllBeneficiaries,
  getBeneficiaryById,
  createBeneficiary,
  updateBeneficiary,
  deleteBeneficiary,
};

export default beneficiaryService;