import axiosClient from "../api/axiosClient";

// =======================
// GET ALL NOTIFICATIONS
// =======================
const getNotifications = async () => {
  const response = await axiosClient.get("/notifications");
  return response.data;
};

// =======================
// GET UNREAD NOTIFICATIONS
// =======================
const getUnreadNotifications = async () => {
  const response = await axiosClient.get("/notifications/unread");
  return response.data;
};

// =======================
// GET UNREAD COUNT
// =======================
const getUnreadCount = async () => {
  const response = await axiosClient.get("/notifications/unread/count");
  return response.data;
};

// =======================
// MARK NOTIFICATION AS READ
// =======================
const markAsRead = async (id) => {
  const response = await axiosClient.put(`/notifications/${id}/read`);
  return response.data;
};

// =======================
// MARK ALL AS READ
// =======================
const markAllAsRead = async () => {
  const response = await axiosClient.put("/notifications/read-all");
  return response.data;
};

const notificationService = {
  getNotifications,
  getUnreadNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};

export default notificationService;