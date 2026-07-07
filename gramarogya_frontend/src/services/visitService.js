import axiosClient from "../api/axiosClient";

const BASE_URL = "/visits";

const getAllVisits = async () => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};

const getVisitById = async (id) => {
  const response = await axiosClient.get(`${BASE_URL}/${id}`);
  return response.data;
};

const createVisit = async (visit) => {
  const response = await axiosClient.post(BASE_URL, visit);
  return response.data;
};

const updateVisit = async (id, visit) => {
  const response = await axiosClient.put(`${BASE_URL}/${id}`, visit);
  return response.data;
};

const deleteVisit = async (id) => {
  await axiosClient.delete(`${BASE_URL}/${id}`);
};


const visitService = {
    getAllVisits,
    getVisitById, 
    createVisit,
    updateVisit,
    deleteVisit,
};

export default visitService;