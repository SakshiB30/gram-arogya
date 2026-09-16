import axiosClient from "../api/axiosClient";

const BASE_URL = "/visits";

/* =========================================================
   GET ALL VISITS
========================================================= */

const getAllVisits = async () => {
  const response = await axiosClient.get(BASE_URL);

  return response.data;
};


/* =========================================================
   GET VISIT BY ID
========================================================= */

const getVisitById = async (id) => {
  const response = await axiosClient.get(
    `${BASE_URL}/${id}`
  );

  return response.data;
};


/* =========================================================
   CREATE VISIT
========================================================= */
const createVisit = async (visit) => {
  const response = await axiosClient.post(
    BASE_URL,
    visit
  );

  return response.data;
};

/* =========================================================
   UPDATE VISIT
========================================================= */

const updateVisit = async (id, visit) => {
  const response = await axiosClient.put(
    `${BASE_URL}/${id}`,
    visit
  );

  return response.data;
};


/* =========================================================
   DELETE VISIT
========================================================= */

const deleteVisit = async (id) => {
  const response = await axiosClient.delete(
    `${BASE_URL}/${id}`
  );

  return response.data;
};


/* =========================================================
   GET TODAY'S VISITS
   Date only - no scheduled time
========================================================= */

const getTodayVisits = async () => {
  const response = await axiosClient.get(
    `${BASE_URL}/today`
  );

  return response.data;
};


/* =========================================================
   EXPORT
========================================================= */

export default {
  getAllVisits,
  getVisitById,
  createVisit,
  updateVisit,
  deleteVisit,
  getTodayVisits,
};