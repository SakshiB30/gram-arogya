import db from "./db";

/*
 * Save a health record into IndexedDB.
 *
 * Used when:
 * - data is downloaded from backend
 * - an online health record is created
 * - an online health record is updated
 * - a synced record needs to be refreshed locally
 */
export const saveHealthRecordOffline = async (
  healthRecord
) => {
  if (!healthRecord) {
    return null;
  }

  await db.healthRecords.put(
    healthRecord
  );

  return healthRecord;
};

/*
 * Create a NEW health record locally.
 *
 * This is mainly used by the offline Redux flow.
 *
 * The record should already contain:
 *
 * id: LOCAL_HEALTH_xxx
 * syncStatus: PENDING
 * isOffline: true
 */
export const createOfflineHealthRecord = async (
  healthRecord
) => {
  if (!healthRecord) {
    return null;
  }

  await db.healthRecords.put(
    healthRecord
  );

  return healthRecord;
};

/*
 * Get all health records stored locally.
 */
export const getOfflineHealthRecords =
  async () => {
    return await db.healthRecords.toArray();
  };

/*
 * Get health records for one beneficiary.
 */
export const getOfflineHealthRecordsByBeneficiary =
  async (beneficiaryId) => {
    if (!beneficiaryId) {
      return [];
    }

    return await db.healthRecords
      .where("beneficiaryId")
      .equals(beneficiaryId)
      .toArray();
  };

/*
 * Get health records for one visit.
 */
export const getOfflineHealthRecordsByVisit =
  async (visitId) => {
    if (!visitId) {
      return [];
    }

    return await db.healthRecords
      .where("visitId")
      .equals(visitId)
      .toArray();
  };

/*
 * Get one health record by ID.
 */
export const getOfflineHealthRecordById =
  async (id) => {
    if (!id) {
      return null;
    }

    return await db.healthRecords.get(id);
  };

/*
 * Update a health record while offline.
 *
 * The important part is:
 *
 * syncStatus = PENDING
 *
 * This tells the sync engine:
 *
 * "This local record has changed and needs
 * to be sent to the backend."
 */
export const updateOfflineHealthRecord =
  async (
    id,
    healthRecordData
  ) => {
    if (!id) {
      throw new Error(
        "Health Record ID is required."
      );
    }

    const existingHealthRecord =
      await db.healthRecords.get(id);

    if (!existingHealthRecord) {
      throw new Error(
        "Health record not found offline."
      );
    }

    const updatedHealthRecord = {
      ...existingHealthRecord,
      ...healthRecordData,

      /*
       * Always preserve the same local/server ID
       * during an update.
       */
      id,

      /*
       * The updated record needs synchronization.
       */
      syncStatus: "PENDING",

      isOffline: true,

      updatedAt:
        new Date().toISOString(),
    };

    await db.healthRecords.put(
      updatedHealthRecord
    );

    return updatedHealthRecord;
  };

/*
 * Delete a health record while offline.
 *
 * There are TWO different cases.
 *
 * CASE 1:
 * Local-only record
 *
 * id = LOCAL_HEALTH_xxx
 *
 * It has never reached the backend.
 *
 * Therefore we can safely remove it from IndexedDB.
 *
 *
 * CASE 2:
 * Server health record
 *
 * It has a real MongoDB ID.
 *
 * We CANNOT immediately remove it from IndexedDB
 * because the sync engine still needs to know:
 *
 * "Delete this record from the backend."
 *
 * Therefore we keep it with:
 *
 * syncStatus = PENDING_DELETE
 */
export const deleteOfflineHealthRecord =
  async (id) => {
    if (!id) {
      throw new Error(
        "Health Record ID is required."
      );
    }

    const existingHealthRecord =
      await db.healthRecords.get(id);

    if (!existingHealthRecord) {
      throw new Error(
        "Health record not found offline."
      );
    }

    /*
     * LOCAL_HEALTH records have never been
     * synchronized with the backend.
     */
    if (
      typeof id === "string" &&
      id.startsWith("LOCAL_HEALTH_")
    ) {
      await db.healthRecords.delete(id);

      /*
       * This return value is useful to Redux,
       * but the record is no longer stored locally.
       */
      return {
        ...existingHealthRecord,
        id,
        syncStatus: "LOCAL_DELETED",
        isOffline: true,
        updatedAt:
          new Date().toISOString(),
      };
    }

    /*
     * Existing server record.
     *
     * Keep it locally until sync completes.
     */
    const deletedHealthRecord = {
      ...existingHealthRecord,

      syncStatus: "PENDING_DELETE",

      isOffline: true,

      updatedAt:
        new Date().toISOString(),
    };

    await db.healthRecords.put(
      deletedHealthRecord
    );

    return deletedHealthRecord;
  };

/*
 * Mark a health record as successfully synchronized.
 *
 * This helper is useful when the sync engine receives
 * the server response and wants to update IndexedDB.
 */
export const markHealthRecordSynced =
  async (
    localId,
    serverHealthRecord
  ) => {
    if (!localId) {
      return null;
    }

    /*
     * If backend returned the complete record,
     * prefer that version.
     *
     * Otherwise use the existing local record.
     */
    const existingHealthRecord =
      await db.healthRecords.get(
        localId
      );

    if (!existingHealthRecord) {
      return null;
    }

    const syncedHealthRecord = {
      ...existingHealthRecord,
      ...(serverHealthRecord || {}),

      /*
       * The server ID should be used after successful
       * synchronization when available.
       */
      id:
        serverHealthRecord?.id ||
        existingHealthRecord.id,

      syncStatus: "SYNCED",

      isOffline: false,

      updatedAt:
        new Date().toISOString(),
    };

    /*
     * If the server returned a different ID,
     * remove the temporary local record first.
     */
    if (
      serverHealthRecord?.id &&
      serverHealthRecord.id !== localId
    ) {
      await db.healthRecords.delete(
        localId
      );
    }

    await db.healthRecords.put(
      syncedHealthRecord
    );

    return syncedHealthRecord;
  };

/*
 * Remove a health record completely from IndexedDB.
 *
 * This should generally be used only after a DELETE
 * operation has been successfully synchronized.
 */
export const removeOfflineHealthRecord =
  async (id) => {
    if (!id) {
      return;
    }

    await db.healthRecords.delete(id);
  };
