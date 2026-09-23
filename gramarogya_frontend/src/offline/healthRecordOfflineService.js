import db from "./db";

const getHealthRecordOwnerId = (
  record
) => {
  if (!record) {
    return null;
  }

  return (
    record.ashaId ??
    record.recordedBy ??
    record.userId ??
    null
  );
};

const normalizeHealthRecord = (
  record
) => {
  if (!record) {
    return record;
  }

  const ownerId =
    getHealthRecordOwnerId(record);

  return {
    ...record,
    ashaId: ownerId ?? record.ashaId,
    recordedBy:
      record.recordedBy ?? ownerId,
  };
};

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

  const normalizedRecord =
    normalizeHealthRecord(healthRecord);

  await db.healthRecords.put(
    normalizedRecord
  );

  return normalizedRecord;
};

/*
 * Create a NEW health record locally.
 *
 * Used by the offline Redux flow.
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
 * Get all health records belonging
 * to the logged-in ASHA.
 */
export const getOfflineHealthRecords = async (
  ashaId
) => {
  if (!ashaId) {
    return [];
  }

  const healthRecords =
    await db.healthRecords.toArray();

  return healthRecords.filter(
    (record) => {
      const ownerId =
        getHealthRecordOwnerId(record);

      return (
        ownerId === ashaId ||
        (!ownerId &&
          (record.ashaId === ashaId ||
            record.recordedBy === ashaId))
      );
    }
  );
};

/*
 * Get health records for one beneficiary
 * belonging to the logged-in ASHA.
 */
export const getOfflineHealthRecordsByBeneficiary =
  async (
    beneficiaryId,
    ashaId
  ) => {
    if (!beneficiaryId || !ashaId) {
      return [];
    }

    const healthRecords =
      await db.healthRecords
        .where("beneficiaryId")
        .equals(beneficiaryId)
        .toArray();

    return healthRecords.filter(
      (record) => {
        const ownerId =
          getHealthRecordOwnerId(record);

        return (
          ownerId === ashaId ||
          (!ownerId &&
            (record.ashaId === ashaId ||
              record.recordedBy === ashaId))
        );
      }
    );
  };

/*
 * Get health records for one visit
 * belonging to the logged-in ASHA.
 */
export const getOfflineHealthRecordsByVisit =
  async (
    visitId,
    ashaId
  ) => {
    if (!visitId || !ashaId) {
      return [];
    }

    const healthRecords =
      await db.healthRecords
        .where("visitId")
        .equals(visitId)
        .toArray();

    return healthRecords.filter(
      (record) => {
        const ownerId =
          getHealthRecordOwnerId(record);

        return (
          ownerId === ashaId ||
          (!ownerId &&
            (record.ashaId === ashaId ||
              record.recordedBy === ashaId))
        );
      }
    );
  };

/*
 * Get one health record by ID.
 *
 * Security:
 * The record must belong to the
 * currently logged-in ASHA.
 */
export const getOfflineHealthRecordById =
  async (
    id,
    ashaId
  ) => {
    if (!id || !ashaId) {
      return null;
    }

    const healthRecord =
      await db.healthRecords.get(id);

    if (!healthRecord) {
      return null;
    }

    const ownerId =
      getHealthRecordOwnerId(healthRecord);

    if (
      ownerId !== ashaId &&
      !(
        !ownerId &&
        (healthRecord.ashaId === ashaId ||
          healthRecord.recordedBy === ashaId)
      )
    ) {
      console.warn(
        "OFFLINE HEALTH RECORD ACCESS DENIED:",
        {
          healthRecordId: id,
          requestedAshaId: ashaId,
          ownerAshaId: ownerId,
        }
      );

      return null;
    }

    return normalizeHealthRecord(healthRecord);
  };

/*
 * Update a health record while offline.
 *
 * Security:
 * Only the ASHA who owns the record
 * can update it.
 */
export const updateOfflineHealthRecord =
  async (
    id,
    healthRecordData,
    ashaId
  ) => {
    if (!id || !ashaId) {
      throw new Error(
        "Health Record ID and ASHA ID are required."
      );
    }

    const existingHealthRecord =
      await db.healthRecords.get(id);

    if (!existingHealthRecord) {
      throw new Error(
        "Health record not found offline."
      );
    }

    if (
      existingHealthRecord.ashaId !==
      ashaId
    ) {
      throw new Error(
        "You are not authorized to update this health record."
      );
    }

    const updatedHealthRecord = {
      ...existingHealthRecord,
      ...healthRecordData,

      id,

      /*
       * Always preserve the owner.
       */
      ashaId,

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
 * CASE 1:
 * Local-only record
 *
 * LOCAL_HEALTH_xxx
 *
 * It has never reached the backend,
 * so it can be removed immediately.
 *
 *
 * CASE 2:
 * Server health record
 *
 * It has a real server ID.
 *
 * Keep it locally with PENDING_DELETE
 * until backend synchronization succeeds.
 */
export const deleteOfflineHealthRecord =
  async (
    id,
    ashaId
  ) => {
    if (!id || !ashaId) {
      throw new Error(
        "Health Record ID and ASHA ID are required."
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
     * SECURITY CHECK
     *
     * Only the owning ASHA can delete
     * the health record.
     */
    if (
      existingHealthRecord.ashaId !==
      ashaId
    ) {
      throw new Error(
        "You are not authorized to delete this health record."
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

      ashaId,

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
 * Mark a health record as successfully
 * synchronized.
 *
 * Security:
 * The record must belong to the
 * logged-in ASHA.
 */
export const markHealthRecordSynced =
  async (
    localId,
    serverHealthRecord,
    ashaId
  ) => {
    if (!localId || !ashaId) {
      return null;
    }

    const existingHealthRecord =
      await db.healthRecords.get(
        localId
      );

    if (!existingHealthRecord) {
      return null;
    }

    /*
     * SECURITY CHECK
     */
    if (
      existingHealthRecord.ashaId !==
      ashaId
    ) {
      console.warn(
        "OFFLINE HEALTH RECORD SYNC ACCESS DENIED:",
        {
          healthRecordId: localId,
          requestedAshaId: ashaId,
          ownerAshaId:
            existingHealthRecord.ashaId,
        }
      );

      return null;
    }

    /*
     * If backend returned the complete
     * record, prefer that version.
     */
    const syncedHealthRecord = {
      ...existingHealthRecord,
      ...(serverHealthRecord || {}),

      /*
       * Preserve ASHA ownership locally.
       */
      ashaId,

      /*
       * Use server ID after successful
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
     * If server returned a different ID,
     * remove temporary local record first.
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
 * Remove a health record completely
 * from IndexedDB.
 *
 * Used after DELETE synchronization
 * succeeds.
 */
export const removeOfflineHealthRecord =
  async (
    id,
    ashaId
  ) => {
    if (!id || !ashaId) {
      return;
    }

    const existingHealthRecord =
      await db.healthRecords.get(id);

    if (!existingHealthRecord) {
      return;
    }

    /*
     * Security check before permanent deletion.
     */
    if (
      existingHealthRecord.ashaId !==
      ashaId
    ) {
      console.warn(
        "OFFLINE HEALTH RECORD DELETE ACCESS DENIED:",
        {
          healthRecordId: id,
          requestedAshaId: ashaId,
          ownerAshaId:
            existingHealthRecord.ashaId,
        }
      );

      return;
    }

    await db.healthRecords.delete(id);
  };