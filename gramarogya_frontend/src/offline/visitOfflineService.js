import db from "./db";

/**
 * Create a visit locally.
 *
 * Used when ASHA creates a visit
 * while offline.
 */
export const createOfflineVisit = async (
  visit
) => {
  if (!visit) {
    return;
  }

  await db.visits.put(visit);

  return visit;
};

/**
 * Save all visits to IndexedDB.
 *
 * Used when fetching visits from backend
 * while online.
 *
 * Important:
 * Pending offline visits must not be deleted
 * when fresh backend data is downloaded.
 */
export const saveVisitsOffline = async (
  visits
) => {
  if (!Array.isArray(visits)) {
    return;
  }

  const pendingVisits =
    await db.visits
      .filter(
        (visit) =>
          visit.syncStatus === "PENDING" ||
          visit.syncStatus === "SYNCING" ||
          visit.syncStatus === "FAILED" ||
          visit.syncStatus === "PENDING_DELETE"
      )
      .toArray();

  await db.transaction(
    "rw",
    db.visits,
    async () => {
      await db.visits.clear();

      await db.visits.bulkPut(visits);

      if (pendingVisits.length > 0) {
        await db.visits.bulkPut(
          pendingVisits
        );
      }
    }
  );

  return visits;
};

/**
 * Save or update one visit locally.
 *
 * Used when fetching a single visit
 * from backend while online.
 */
export const saveVisitOffline = async (
  visit
) => {
  if (!visit) {
    return;
  }

  await db.visits.put(visit);

  return visit;
};

/**
 * Add or update visits without deleting
 * existing local visits.
 *
 * Important for today's visits because
 * there may already be locally created
 * offline visits.
 */
export const upsertVisitsOffline = async (
  visits
) => {
  if (!Array.isArray(visits)) {
    return;
  }

  await db.visits.bulkPut(visits);

  return visits;
};

/**
 * Get all locally stored visits
 * belonging to the logged-in ASHA.
 */
export const getOfflineVisits = async (
  ashaId
) => {
  if (!ashaId) {
    return [];
  }

  const visits =
    await db.visits.toArray();

  return visits.filter(
    (visit) =>
      visit.ashaId === ashaId
  );
};

/**
 * Get visits for a beneficiary
 * belonging to the logged-in ASHA.
 */
export const getOfflineVisitsByBeneficiary =
  async (
    beneficiaryId,
    ashaId
  ) => {
    if (!beneficiaryId || !ashaId) {
      return [];
    }

    const visits =
      await db.visits
        .where("beneficiaryId")
        .equals(beneficiaryId)
        .toArray();

    return visits.filter(
      (visit) =>
        visit.ashaId === ashaId
    );
  };

/**
 * Get today's visits
 * belonging to the logged-in ASHA.
 */
export const getOfflineTodayVisits = async (
  today,
  ashaId
) => {
  if (!today || !ashaId) {
    return [];
  }

  const visits =
    await db.visits
      .where("scheduledDate")
      .equals(today)
      .toArray();

  return visits.filter(
    (visit) =>
      visit.ashaId === ashaId
  );
};

/**
 * Get one visit by ID
 * only if it belongs to the requested ASHA.
 */
export const getOfflineVisitById = async (
  id,
  ashaId
) => {
  if (!id || !ashaId) {
    return null;
  }

  const visit =
    await db.visits.get(id);

  if (!visit) {
    return null;
  }

  if (visit.ashaId !== ashaId) {
    console.warn(
      "OFFLINE VISIT ACCESS DENIED:",
      {
        visitId: id,
        requestedAshaId: ashaId,
        ownerAshaId: visit.ashaId,
      }
    );

    return null;
  }

  return visit;
};
/**
 * Update a visit locally.
 *
 * Used when ASHA edits a visit
 * while offline.
 */
export const updateOfflineVisit = async (
  id,
  visitData,
  ashaId
) => {
  if (!id || !ashaId) {
    throw new Error(
      "Visit ID and ASHA ID are required."
    );
  }

  const existingVisit =
    await db.visits.get(id);

  if (!existingVisit) {
    throw new Error(
      "Visit not found offline."
    );
  }

  if (existingVisit.ashaId !== ashaId) {
    console.warn(
      "OFFLINE VISIT UPDATE DENIED:",
      {
        visitId: id,
        requestedAshaId: ashaId,
        ownerAshaId: existingVisit.ashaId,
      }
    );

    throw new Error(
      "You are not authorized to update this visit."
    );
  }

  const updatedVisit = {
    ...existingVisit,
    ...visitData,

    id,
    ashaId,

    syncStatus: "PENDING",
    isOffline: true,

    updatedAt:
      new Date().toISOString(),
  };

  await db.visits.put(
    updatedVisit
  );

  return updatedVisit;
};

/**
 * Mark a visit for deletion locally.
 *
 * The visit is kept in IndexedDB until
 * the backend confirms the DELETE operation.
 */
export const deleteOfflineVisit =
  async (id, ashaId) => {
    if (!id || !ashaId) {
      throw new Error(
        "Visit ID and ASHA ID are required."
      );
    }

    const existingVisit =
      await db.visits.get(id);

    if (!existingVisit) {
      throw new Error(
        "Visit not found offline."
      );
    }

    if (existingVisit.ashaId !== ashaId) {
      console.warn(
        "OFFLINE VISIT DELETE DENIED:",
        {
          visitId: id,
          requestedAshaId: ashaId,
          ownerAshaId: existingVisit.ashaId,
        }
      );

      throw new Error(
        "You are not authorized to delete this visit."
      );
    }

    const deletedVisit = {
      ...existingVisit,

      syncStatus:
        "PENDING_DELETE",

      isOffline: true,

      updatedAt:
        new Date().toISOString(),
    };

    await db.visits.put(
      deletedVisit
    );

    return deletedVisit;
  };