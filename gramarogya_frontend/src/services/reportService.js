import axiosClient from "../api/axiosClient";


// ==========================
// GET ALL REPORTS
// ==========================
const getReports = async () => {

  const response = await axiosClient.get("/reports");

  return response.data;

};


// ==========================
// GET REPORT BY ID
// ==========================
const getReportById = async (id) => {

  const response = await axiosClient.get(
    `/reports/${id}`
  );

  return response.data;

};


// ==========================
// CREATE REPORT
// ==========================
const createReport = async (reportData) => {

  const response = await axiosClient.post(
    "/reports",
    reportData
  );

  return response.data;

};


// ==========================
// UPDATE REPORT
// ==========================
const updateReport = async (
  id,
  reportData
) => {

  const response = await axiosClient.put(
    `/reports/${id}`,
    reportData
  );

  return response.data;

};


// ==========================
// DELETE REPORT
// ==========================
const deleteReport = async (id) => {

  const response = await axiosClient.delete(
    `/reports/${id}`
  );

  return response.data;

};



const reportService = {

  getReports,

  getReportById,

  createReport,

  updateReport,

  deleteReport,

};


export default reportService;