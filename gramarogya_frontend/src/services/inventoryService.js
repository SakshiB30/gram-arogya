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
const response = await axiosClient.post(
"/inventory",
medicineData
);
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
// RECEIVE / RESTOCK MEDICINE
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
const issueMedicine = async (
id,
issueData
) => {
const response = await axiosClient.post(
`/inventory/${id}/issue`,
issueData
);

return response.data;

};

// =======================
// DELETE MEDICINE
// =======================
const deleteMedicine = async (id) => {
const response = await axiosClient.delete(
`/inventory/${id}`
);

return response.data;

};

// =======================
// GET ALL STOCK LOGS
// =======================
const getStockLogs = async () => {
const response = await axiosClient.get(
"/inventory/logs"
);

return response.data;

};

// =======================
// GET MEDICINE STOCK LOGS
// =======================
const getMedicineLogs = async (id) => {
const response = await axiosClient.get(
`/inventory/${id}/logs`
);

return response.data;

};

// =======================
// GET ALL ISSUED MEDICINES
// =======================
const getIssuedMedicines = async () => {
const response = await axiosClient.get(
"/inventory/issues"
);

return response.data;

};

// =======================
// GET BENEFICIARY MEDICINE HISTORY
// =======================
const getBeneficiaryMedicineHistory = async (
beneficiaryId
) => {
const response = await axiosClient.get(
`/inventory/issues/beneficiary/${beneficiaryId}`
);

return response.data;

};

// =======================
// EXPORT
// =======================
const inventoryService = {
getInventory,
getMedicineById,
addMedicine,
updateMedicine,
receiveMedicine,
issueMedicine,
deleteMedicine,
getStockLogs,
getMedicineLogs,
getIssuedMedicines,
getBeneficiaryMedicineHistory,
};

export default inventoryService;
