import axiosClient from "../api/axiosClient";

const BASE_URL = "/health-records";

const getAllHealthRecords = async () => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};

const getHealthRecordById = async (id) => {
  const response = await axiosClient.get(`${BASE_URL}/${id}`);
  return response.data;
};

const getHealthRecordsByBeneficiary = async (beneficiaryId) => {
  const response = await axiosClient.get(
    `${BASE_URL}/beneficiary/${beneficiaryId}`
  );
  return response.data;
};

const getHealthRecordsByVisit = async (visitId) => {
  const response = await axiosClient.get(
    `${BASE_URL}/visit/${visitId}`
  );
  return response.data;
};

const createHealthRecord = async (healthRecord) => {
  const response = await axiosClient.post(BASE_URL, healthRecord);
  return response.data;
};

const updateHealthRecord = async (id, healthRecord) => {
  const response = await axiosClient.put(
    `${BASE_URL}/${id}`,
    healthRecord
  );
  return response.data;
};

const deleteHealthRecord = async (id) => {
  const response = await axiosClient.delete(`${BASE_URL}/${id}`);
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