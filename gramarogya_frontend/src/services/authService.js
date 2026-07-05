import axiosClient from "../api/axiosClient";

/**
 * Login User
 */
const login = async (credentials) => {
  const response = await axiosClient.post("/auth/login", credentials);

  return response.data;
};

/**
 * Register User
 */
const register = async (userData) => {
  const response = await axiosClient.post("/auth/register", userData);

  return response.data;
};

const authService = {
  login,
  register,
};


export default authService;