import axiosClient from "../api/axiosClient";

// ================================
// ANM - ASHA MANAGEMENT
// ================================

const getPendingAshas = async () => {
  const response = await axiosClient.get("/anm/pending-ashas");
  return response.data;
};

const approveAsha = async (ashaId) => {
  const response = await axiosClient.put(
    `/anm/approve-asha/${ashaId}`
  );
  return response.data;
};

const rejectAsha = async (ashaId) => {
  const response = await axiosClient.put(
    `/anm/reject-asha/${ashaId}`
  );
  return response.data;
};

const getAllAshas = async () => {
  const response = await axiosClient.get("/anm/all-ashas");
  return response.data;
};

const anmService = {
  getPendingAshas,
  approveAsha,
  rejectAsha,
  getAllAshas,
};

export default anmService;