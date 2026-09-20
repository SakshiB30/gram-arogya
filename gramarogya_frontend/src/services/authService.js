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

const sendForgotPasswordOtp = async (email) => {
  const response = await axiosClient.post(
    "/auth/forgot-password/send-otp",
    { email }
  );

  return response.data;
};

const verifyForgotPasswordOtp = async (email, code) => {
  const response = await axiosClient.post(
    "/auth/forgot-password/verify-otp",
    {
      email,
      code,
    }
  );

  return response.data;
};

const resetPassword = async (resetToken, newPassword) => {
  const response = await axiosClient.post(
    "/auth/forgot-password/reset",
    {
      resetToken,
      newPassword,
    }
  );

  return response.data;
};


const authService = {
    login,
    registerAnm,
    registerAsha,
    sendForgotPasswordOtp,  
    verifyForgotPasswordOtp,
    resetPassword
};


export default authService;