import axiosClient from "../api/axiosClient";

// =======================
// GET ALL MEDICINES
// =======================
const getInventory = async () => {
  const response = await axiosClient.get("/inventory");
  return response.data;
};

// =======================
// GET MEDICINE BY ID
// =======================
const getMedicineById = async (id) => {
  const response = await axiosClient.get(`/inventory/${id}`);
  return response.data;
};

// =======================
// ADD MEDICINE
// =======================
const addMedicine = async (medicineData) => {
  const response = await axiosClient.post("/inventory", medicineData);
  return response.data;
};

// =======================
// UPDATE MEDICINE
// =======================
const updateMedicine = async (id, medicineData) => {
  const response = await axiosClient.put(
    `/inventory/${id}`,
    medicineData
  );
  return response.data;
};

// =======================
// RECEIVE MEDICINE
// =======================
const receiveMedicine = async (id, quantity) => {
  const response = await axiosClient.patch(
    `/inventory/${id}/receive`,
    { quantity }
  );
  return response.data;
};

// =======================
// ISSUE MEDICINE
// =======================
const issueMedicine = async (id, quantity) => {
  const response = await axiosClient.patch(
    `/inventory/${id}/issue`,
    { quantity }
  );
  return response.data;
};

// =======================
// DELETE MEDICINE
// =======================
const deleteMedicine = async (id) => {
  const response = await axiosClient.delete(`/inventory/${id}`);
  return response.data;
};

const inventoryService = {
  getInventory,
  getMedicineById,
  addMedicine,
  updateMedicine,
  receiveMedicine,
  issueMedicine,
  deleteMedicine,
};

export default inventoryService;