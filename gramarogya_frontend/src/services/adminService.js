import axiosClient from "../api/axiosClient";

// ================================
// ANM
// ================================

const getPendingAnms = async () => {
  const response = await axiosClient.get("/admin/pending-anms");
  return response.data;
};

const approveAnm = async (id) => {
  const response = await axiosClient.put(`/admin/approve-anm/${id}`);
  return response.data;
};

const rejectAnm = async (id) => {
  const response = await axiosClient.put(`/admin/reject-anm/${id}`);
  return response.data;
};

const blockAnm = async (id) => {
  const response = await axiosClient.put(`/admin/block-anm/${id}`);
  return response.data;
};

const unblockAnm = async (id) => {
  const response = await axiosClient.put(`/admin/unblock-anm/${id}`);
  return response.data;
};

const getAllAnms = async () => {
  const response = await axiosClient.get("/admin/all-anms");
  return response.data;
};


// ================================
// ASHA
// ================================

const getAllAshas = async () => {
  const response = await axiosClient.get("/admin/all-ashas");
  return response.data;
};

const blockAsha = async (id) => {
  const response = await axiosClient.put(`/admin/block-asha/${id}`);
  return response.data;
};

const unblockAsha = async (id) => {
  const response = await axiosClient.put(`/admin/unblock-asha/${id}`);
  return response.data;
};


// ================================
// ALL USERS
// ================================

const getAllUsers = async () => {
  const response = await axiosClient.get("/admin/users");
  return response.data;
};


// ================================
// EXPORT
// ================================

const adminService = {
  // ANM
  getPendingAnms,
  approveAnm,
  rejectAnm,
  blockAnm,
  unblockAnm,
  getAllAnms,

  // ASHA
  getAllAshas,
  blockAsha,
  unblockAsha,

  // Users
  getAllUsers,
};

export default adminService;