import axiosClient from "../api/axiosClient";

const BASE_URL = "/health-records";

/*
 * Get all health records.
 *
 * Backend:
 * GET /health-records?page=0&size=10
 */
const getAllHealthRecords = async (
  page = 0,
  size = 10
) => {
  const response = await axiosClient.get(
    BASE_URL,
    {
      params: {
        page,
        size,
      },
    }
  );

  return response.data;
};

/*
 * Get one health record by ID.
 *
 * Backend:
 * GET /health-records/{id}
 */
const getHealthRecordById = async (id) => {
  if (!id) {
    throw new Error(
      "Health Record ID is required."
    );
  }

  const response =
    await axiosClient.get(
      `${BASE_URL}/${id}`
    );

  return response.data;
};

/*
 * Get health records belonging to a beneficiary.
 *
 * Backend:
 * GET /health-records/beneficiary/{beneficiaryId}
 */
const getHealthRecordsByBeneficiary =
  async (beneficiaryId) => {
    if (!beneficiaryId) {
      throw new Error(
        "Beneficiary ID is required."
      );
    }

    const response =
      await axiosClient.get(
        `${BASE_URL}/beneficiary/${beneficiaryId}`
      );

    return response.data;
  };

/*
 * Get health records belonging to a visit.
 *
 * Backend:
 * GET /health-records/visit/{visitId}
 */
const getHealthRecordsByVisit =
  async (visitId) => {
    if (!visitId) {
      throw new Error(
        "Visit ID is required."
      );
    }

    const response =
      await axiosClient.get(
        `${BASE_URL}/visit/${visitId}`
      );

    return response.data;
  };

/*
 * Create a health record.
 *
 * Backend:
 * POST /health-records
 *
 * This function is used ONLY when the application
 * is online.
 *
 * The Redux slice decides whether the application
 * should call this function or save to IndexedDB.
 */
const createHealthRecord = async (
  healthRecord
) => {
  if (!healthRecord) {
    throw new Error(
      "Health record data is required."
    );
  }

  const response =
    await axiosClient.post(
      BASE_URL,
      healthRecord
    );

  return response.data;
};

/*
 * Update a health record.
 *
 * Backend:
 * PUT /health-records/{id}
 */
const updateHealthRecord = async (
  id,
  healthRecord
) => {
  if (!id) {
    throw new Error(
      "Health Record ID is required."
    );
  }

  if (!healthRecord) {
    throw new Error(
      "Health record data is required."
    );
  }

  const response =
    await axiosClient.put(
      `${BASE_URL}/${id}`,
      healthRecord
    );

  return response.data;
};

/*
 * Delete a health record.
 *
 * Backend:
 * DELETE /health-records/{id}
 */
const deleteHealthRecord = async (id) => {
  if (!id) {
    throw new Error(
      "Health Record ID is required."
    );
  }

  await axiosClient.delete(
    `${BASE_URL}/${id}`
  );

  /*
   * Backend returns 204 No Content.
   *
   * Therefore there is no response body
   * that needs to be returned.
   */
  return id;
};

const healthRecordService = {
  getAllHealthRecords,
  getHealthRecordById,
  getHealthRecordsByBeneficiary,
  getHealthRecordsByVisit,
  createHealthRecord,
  updateHealthRecord,
  deleteHealthRecord,
};

export default healthRecordService;
