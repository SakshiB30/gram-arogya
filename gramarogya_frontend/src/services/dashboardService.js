import axiosClient from "../api/axiosClient";

const getDashboard = async () => {
  const response = await axiosClient.get("/dashboard");
  return response.data;
};

const getRecentActivities = async () => {
  const response = await axiosClient.get(
    "/dashboard/recent-activities"
  );
  return response.data;
};

const getAlerts = async () => {
  const response = await axiosClient.get(
    "/dashboard/alerts"
  );
  return response.data;
};

const dashboardService = {
  getDashboard,
  getRecentActivities,
  getAlerts,
};

export default dashboardService;