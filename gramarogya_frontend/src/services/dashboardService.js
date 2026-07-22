import axiosClient from "../api/axiosClient";

const getDashboard = async () => {
  const response = await axiosClient.get("/dashboard");
  return response.data;
};

export default {
  getDashboard,
};