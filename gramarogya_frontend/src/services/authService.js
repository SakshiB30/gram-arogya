import axiosClient from "../api/axiosClient";

/**
 * Login User
 */
const login = async (credentials) => {
  const response = await axiosClient.post("/auth/login", credentials);

  return response.data;
};

const registerAnm = async (userData) => {
    const response = await axiosClient.post(
        "/auth/register-anm",
        userData
    );

    return response.data;
};

const registerAsha = async (userData) => {
    const response = await axiosClient.post(
        "/auth/register-asha",
        userData
    );

    return response.data;
};

const authService = {
  login,
  registerAnm,
  registerAsha,
};


export default authService;