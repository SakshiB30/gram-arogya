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

  const pendingVisits = await db.visits
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
        await db.visits.bulkPut(pendingVisits);
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
 * Get all locally stored visits.
 */
export const getOfflineVisits = async () => {
  return await db.visits.toArray();
};

/**
 * Get visits for a beneficiary.
 */
export const getOfflineVisitsByBeneficiary =
  async (beneficiaryId) => {
    if (!beneficiaryId) {
      return [];
    }

    return await db.visits
      .where("beneficiaryId")
      .equals(beneficiaryId)
      .toArray();
  };

/**
 * Get today's visits.
 */
export const getOfflineTodayVisits = async (
  today
) => {
  if (!today) {
    return [];
  }

  return await db.visits
    .where("scheduledDate")
    .equals(today)
    .toArray();
};

/**
 * Get one visit by ID.
 */
export const getOfflineVisitById = async (
  id
) => {
  if (!id) {
    return null;
  }

  return await db.visits.get(id);
};

/**
 * Update a visit locally.
 *
 * Used when ASHA edits a visit
 * while offline.
 */
export const updateOfflineVisit = async (
  id,
  visitData
) => {
  if (!id) {
    throw new Error(
      "Visit ID is required."
    );
  }

  const existingVisit =
    await db.visits.get(id);

  if (!existingVisit) {
    throw new Error(
      "Visit not found offline."
    );
  }

  const updatedVisit = {
    ...existingVisit,
    ...visitData,

    id,

    syncStatus: "PENDING",
    isOffline: true,

    updatedAt: new Date().toISOString(),
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
export const deleteOfflineVisit = async (id) => {
  if (!id) {
    throw new Error(
      "Visit ID is required."
    );
  }

  const existingVisit =
    await db.visits.get(id);

  if (!existingVisit) {
    throw new Error(
      "Visit not found offline."
    );
  }

  const deletedVisit = {
    ...existingVisit,

    syncStatus: "PENDING_DELETE",
    isOffline: true,

    updatedAt: new Date().toISOString(),
  };

  await db.visits.put(deletedVisit);

  return deletedVisit;
};