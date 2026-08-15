import axiosClient from "../api/axiosClient";

const BASE_URL = "/health-records";

// =====================================================
// GET ALL HEALTH RECORDS
// =====================================================

const getAllHealthRecords = async () => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};


// =====================================================
// GET HEALTH RECORD BY ID
// =====================================================

const getHealthRecordById = async (id) => {
  const response = await axiosClient.get(`${BASE_URL}/${id}`);
  return response.data;
};


// =====================================================
// GET HEALTH RECORDS BY BENEFICIARY
// =====================================================

const getHealthRecordsByBeneficiary = async (beneficiaryId) => {
  const response = await axiosClient.get(
    `${BASE_URL}/beneficiary/${beneficiaryId}`
  );

  return response.data;
};


// =====================================================
// GET HEALTH RECORDS BY VISIT
// =====================================================

const getHealthRecordsByVisit = async (visitId) => {
  const response = await axiosClient.get(
    `${BASE_URL}/visit/${visitId}`
  );

  return response.data;
};


// =====================================================
// CREATE HEALTH RECORD
// =====================================================

const createHealthRecord = async (healthRecord) => {
  const response = await axiosClient.post(
    BASE_URL,
    healthRecord
  );

  return response.data;
};


// =====================================================
// UPDATE HEALTH RECORD
// =====================================================

const updateHealthRecord = async (id, healthRecord) => {
  const response = await axiosClient.put(
    `${BASE_URL}/${id}`,
    healthRecord
  );

  return response.data;
};


// =====================================================
// DELETE HEALTH RECORD
// =====================================================

const deleteHealthRecord = async (id) => {
  const response = await axiosClient.delete(
    `${BASE_URL}/${id}`
  );

  return response.data;
};


export default {
  getAllHealthRecords,
  getHealthRecordById,
  getHealthRecordsByBeneficiary,
  getHealthRecordsByVisit,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
};