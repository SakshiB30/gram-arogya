import axiosClient from "../api/axiosClient";

const BASE_URL = "/dashboard";

const getDashboard = async () => {
  const response = await axiosClient.get(BASE_URL);
  return response.data;
};

const dashboardService = {
  getDashboard,
};

export default dashboardService;