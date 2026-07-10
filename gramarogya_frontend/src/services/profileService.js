import axiosClient from "../api/axiosClient";

// =======================
// GET CURRENT USER PROFILE
// =======================
const getProfile = async () => {
  const response = await axiosClient.get("/users/profile");
  return response.data;
};

// =======================
// UPDATE PROFILE
// =======================
const updateProfile = async (profileData) => {
  const response = await axiosClient.put(
    "/users/me",
    profileData
  );
  return response.data;
};

const profileService = {
  getProfile,
  updateProfile,
};

export default profileService;