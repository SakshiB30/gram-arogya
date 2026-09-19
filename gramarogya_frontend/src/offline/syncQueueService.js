import db from "./db";

/*
 * Add a new operation to the offline sync queue.
 *
 * Every offline CREATE / UPDATE / DELETE operation
 * comes here.
 *
 * ashaId identifies the ASHA who created the
 * offline operation.
 */
export const addToSyncQueue = async ({
  operationId,
  entityType,
  operation,
  localId,
  payload,
  ashaId,
}) => {
  if (
    !operationId ||
    !entityType ||
    !operation ||
    !localId
  ) {
    throw new Error(
      "Invalid sync operation data."
    );
  }

  if (!ashaId) {
    throw new Error(
      "ASHA ID is required for offline sync operation."
    );
  }

  const now =
    new Date().toISOString();

  console.log(
    "ADDING TO SYNC QUEUE:",
    {
      operationId,
      entityType,
      operation,
      localId,
      ashaId,
    }
  );

  const queueId =
    await db.syncQueue.add({
      operationId,

      entityType,

      operation,

      localId,

      payload,

      // Store the ASHA who created this operation
      ashaId,

      status: "PENDING",

      retryCount: 0,

      lastError: null,

      createdAt: now,

      updatedAt: now,
    });

  console.log(
    "SYNC QUEUE ADDED. ID:",
    queueId
  );

  return queueId;
};

/*
 * Get operations waiting for synchronization.
 *
 * Only PENDING operations are returned.
 *
 * They are sorted by createdAt so that older
 * operations are processed first.
 */
export const getPendingSyncOperations =
  async () => {
    return await db.syncQueue
      .where("status")
      .equals("PENDING")
      .sortBy("createdAt");
  };

/*
 * Mark an operation as currently syncing.
 *
 * PENDING
 *    ↓
 * SYNCING
 */
export const markSyncing = async (id) => {
  if (!id) {
    return;
  }

  await db.syncQueue.update(id, {
    status: "SYNCING",

    updatedAt:
      new Date().toISOString(),
  });
};

/*
 * Mark an operation as successfully synchronized.
 *
 * SYNCING
 *    ↓
 * SYNCED
 */
export const markSynced = async (id) => {
  if (!id) {
    return;
  }

  await db.syncQueue.update(id, {
    status: "SYNCED",

    retryCount: 0,

    lastError: null,

    updatedAt:
      new Date().toISOString(),
  });
};

/*
 * Mark an operation as failed.
 *
 * Every failure increases retryCount by 1.
 */
export const markSyncFailed = async (
  id,
  errorMessage
) => {
  if (!id) {
    return;
  }

  const operation =
    await db.syncQueue.get(id);

  if (!operation) {
    return;
  }

  await db.syncQueue.update(id, {
    status: "FAILED",

    retryCount:
      (operation.retryCount || 0) + 1,

    lastError:
      errorMessage ||
      "Sync failed.",

    updatedAt:
      new Date().toISOString(),
  });
};

/*
 * Get all failed operations.
 */
export const getFailedSyncOperations =
  async () => {
    return await db.syncQueue
      .where("status")
      .equals("FAILED")
      .sortBy("createdAt");
};

/*
 * Get every operation in the sync queue.
 *
 * This includes:
 *
 * PENDING
 * SYNCING
 * SYNCED
 * FAILED
 */
export const getAllSyncOperations =
  async () => {
    return await db.syncQueue
      .orderBy("createdAt")
      .toArray();
};

/*
 * Retry a failed operation.
 *
 * FAILED
 *    ↓
 * PENDING
 */
export const retrySyncOperation =
  async (id) => {
    if (!id) {
      return;
    }

    const operation =
      await db.syncQueue.get(id);

    if (!operation) {
      return;
    }

    await db.syncQueue.update(id, {
      status: "PENDING",

      lastError: null,

      updatedAt:
        new Date().toISOString(),
    });
  };

/*
 * Remove an operation completely from the queue.
 */
export const removeSyncOperation =
  async (id) => {
    if (!id) {
      return;
    }

    await db.syncQueue.delete(id);
  };