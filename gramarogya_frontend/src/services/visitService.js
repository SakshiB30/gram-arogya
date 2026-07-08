import axiosClient from "../api/axiosClient";

const BASE_URL = "/visits";


// Get all visits
const getAllVisits = async () => {

  const response = await axiosClient.get(BASE_URL);

  return response.data;

};



// Get visit by id
const getVisitById = async (id) => {

  const response = await axiosClient.get(
    `${BASE_URL}/${id}`
  );

  return response.data;

};



// Create visit
const createVisit = async (visit) => {

  const response = await axiosClient.post(
    BASE_URL,
    visit
  );

  return response.data;

};



// Update visit
const updateVisit = async (id, visit) => {

  const response = await axiosClient.put(
    `${BASE_URL}/${id}`,
    visit
  );

  return response.data;

};



// Delete visit
const deleteVisit = async (id) => {

  const response = await axiosClient.delete(
    `${BASE_URL}/${id}`
  );

  return response.data;

};



export default {
  getAllVisits,
  getVisitById,
  createVisit,
  updateVisit,
  deleteVisit,
};