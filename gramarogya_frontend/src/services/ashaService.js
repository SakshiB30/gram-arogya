import axiosClient from "../api/axiosClient";

const register = async (userData) => {
  const response = await axiosClient.post(
    "/asha/register",
    userData
  );

  return response.data;
};

const ashaService = {
  register,
};

export default ashaService;