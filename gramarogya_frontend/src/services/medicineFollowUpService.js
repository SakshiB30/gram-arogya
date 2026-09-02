import axiosClient from "../api/axiosClient";

const medicineFollowUpService = {

  // Create medicine follow-up
  createFollowUp: async (data) => {
    const response = await axiosClient.post(
      "/medicine-followups",
      data
    );
    return response.data;
  },

  // Get follow-ups by beneficiary
  getFollowUpsByBeneficiary: async (beneficiaryId) => {
    const response = await axiosClient.get(
      `/medicine-followups/beneficiary/${beneficiaryId}`
    );
    return response.data;
  },

  // Get follow-ups by visit
  getFollowUpsByVisit: async (visitId) => {
    const response = await axiosClient.get(
      `/medicine-followups/visit/${visitId}`
    );
    return response.data;
  },

  // Get follow-up by ID
  getFollowUpById: async (id) => {
    const response = await axiosClient.get(
      `/medicine-followups/${id}`
    );
    return response.data;
  },
};

export default medicineFollowUpService;