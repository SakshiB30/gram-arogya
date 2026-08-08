import axiosClient from "../api/axiosClient";

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
  const response = await axiosClient.get("/admin/anms");
  return response.data;
};

const adminService = {
  getPendingAnms,
  approveAnm,
  rejectAnm,
  blockAnm,
  unblockAnm,
  getAllAnms,
};

export default adminService;
