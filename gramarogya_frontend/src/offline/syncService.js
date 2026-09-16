import db from "./db";

import visitService from "../services/visitService";
import healthRecordService from "../services/healthRecordService";

import {
  getPendingSyncOperations,
  markSyncing,
  markSynced,
  markSyncFailed,
} from "./syncQueueService";

import {
  saveSyncMapping,
  getServerIdFromLocalId,
} from "./syncMappingService";

/**
 * Remove fields that are used only by IndexedDB.
 *
 * For CREATE operations, the temporary local ID must also
 * be removed because the backend generates the real MongoDB ID.
 */
const cleanPayload = (payload, operationType) => {
  if (!payload) {
    return {};
  }

  const {
    syncStatus,
    isOffline,
    ...serverPayload
  } = payload;

  // For CREATE, don't send the temporary IndexedDB ID
  if (operationType === "CREATE") {
    const {
      id,
      ...createPayload
    } = serverPayload;

    return createPayload;
  }

  return serverPayload;
};

/**
 * Process one sync operation.
 *
 * Returns the server result and, for CREATE operations,
 * keeps track of the mapping between local ID and server ID.
 */
const processSyncOperation = async (
  operation,
  idMappings
) => {
  const {
    id,
    entityType,
    operation: operationType,
    localId,
    payload,
  } = operation;

  try {
    await markSyncing(id);

    let serverPayload = cleanPayload(
      payload,
      operationType
    );

    let result;

    // =====================================================
    // VISIT
    // =====================================================

    if (entityType === "VISIT") {

      // ---------------------------------------------------
      // VISIT CREATE
      // ---------------------------------------------------

      if (operationType === "CREATE") {

        result =
          await visitService.createVisit(
            serverPayload
          );

        /**
         * Backend returns the real MongoDB ID.
         *
         * Example:
         *
         * LOCAL_VISIT_xxx
         *        ↓
         * 6aa6eb665eb75241ccb9e86e
         */
        if (result?.id) {

          /*
           * Store local ID → server ID mapping
           */
          idMappings.visits[localId] =
            result.id;

          /*
           * Persist mapping in IndexedDB
           */
          await saveSyncMapping({
            entityType: "VISIT",
            localId,
            serverId: result.id,
          });

          /*
           * Get local visit
           */
          const localVisit =
            await db.visits.get(
              localId
            );

          if (localVisit) {

            const updatedVisit = {
              ...localVisit,
              ...result,

              /*
               * Replace temporary local ID
               * with real server ID
               */
              id: result.id,

              syncStatus: "SYNCED",
              isOffline: false,
            };

            /*
             * Remove temporary local record
             */
            await db.visits.delete(
              localId
            );

            /*
             * Store using real server ID
             */
            await db.visits.put(
              updatedVisit
            );
          }
        }
      }

      // ---------------------------------------------------
      // VISIT UPDATE
      // ---------------------------------------------------

      else if (
        operationType === "UPDATE"
      ) {

        /*
         * Convert temporary Visit ID
         * to real backend ID if mapping exists.
         */
        const realVisitId =
          idMappings.visits[localId] ||
          await getServerIdFromLocalId({
            entityType: "VISIT",
            localId,
          }) ||
          localId;

        serverPayload = {
          ...serverPayload,
          id: realVisitId,
        };

        result =
          await visitService.updateVisit(
            realVisitId,
            serverPayload
          );
      }

      // ---------------------------------------------------
      // VISIT DELETE
      // ---------------------------------------------------

      else if (
        operationType === "DELETE"
      ) {

        /*
         * Convert temporary Visit ID
         * to real backend ID if mapping exists.
         */
        const realVisitId =
          idMappings.visits[localId] ||
          await getServerIdFromLocalId({
            entityType: "VISIT",
            localId,
          }) ||
          localId;

        try {

          /*
           * Delete Visit from backend
           */
          result =
            await visitService.deleteVisit(
              realVisitId
            );

        } catch (error) {

          /*
           * If the Visit is already deleted
           * on the backend, DELETE has effectively
           * succeeded.
           */
          if (
            error?.response?.status === 404
          ) {
            result = null;
          } else {
            throw error;
          }
        }

        /*
         * Backend DELETE succeeded OR the Visit
         * was already absent from the backend.
         *
         * Now remove the local PENDING_DELETE record.
         */
        await db.visits.delete(
          localId
        );
      }

      // ---------------------------------------------------
      // UNSUPPORTED VISIT OPERATION
      // ---------------------------------------------------

      else {
        throw new Error(
          `Unsupported VISIT operation: ${operationType}`
        );
      }
    }

    // =====================================================
    // HEALTH RECORD
    // =====================================================

    else if (
      entityType === "HEALTH_RECORD"
    ) {

      // ---------------------------------------------------
      // HEALTH RECORD CREATE
      // ---------------------------------------------------

      if (
        operationType === "CREATE"
      ) {

        /**
         * Important:
         *
         * If this Health Record was created for an
         * offline-created Visit, its visitId will be:
         *
         * LOCAL_VISIT_xxx
         *
         * Replace it with the real server Visit ID.
         */
        if (serverPayload.visitId) {

          const mappedVisitId =
            idMappings.visits[
              serverPayload.visitId
            ] ||
            await getServerIdFromLocalId({
              entityType: "VISIT",
              localId:
                serverPayload.visitId,
            });

          if (mappedVisitId) {

            serverPayload = {
              ...serverPayload,
              visitId: mappedVisitId,
            };
          }
        }

        /*
         * Create Health Record on backend
         */
        result =
          await healthRecordService
            .createHealthRecord(
              serverPayload
            );

        /**
         * Backend returns the real MongoDB ID.
         *
         * Example:
         *
         * LOCAL_HEALTH_xxx
         *        ↓
         * 6aa6ec3d5eb75241ccb9e870
         */
        if (result?.id) {

          /*
           * Store local ID → server ID mapping
           */
          idMappings.healthRecords[
            localId
          ] = result.id;

          /*
           * Persist mapping in IndexedDB
           */
          await saveSyncMapping({
            entityType: "HEALTH_RECORD",
            localId,
            serverId: result.id,
          });

          /*
           * Get local health record
           */
          const localHealthRecord =
            await db.healthRecords.get(
              localId
            );

          if (localHealthRecord) {

            const updatedHealthRecord = {
              ...localHealthRecord,
              ...result,

              /*
               * Replace temporary local ID
               * with real server ID
               */
              id: result.id,

              syncStatus: "SYNCED",
              isOffline: false,
            };

            /*
             * Remove temporary local record
             */
            await db.healthRecords.delete(
              localId
            );

            /*
             * Store using real server ID
             */
            await db.healthRecords.put(
              updatedHealthRecord
            );
          }
        }
      }

      // ---------------------------------------------------
      // HEALTH RECORD UPDATE
      // ---------------------------------------------------

      else if (
        operationType === "UPDATE"
      ) {

        /*
         * Convert temporary Health Record ID
         * to real backend ID if mapping exists.
         */
        const realHealthRecordId =
          idMappings.healthRecords[
            localId
          ] ||
          await getServerIdFromLocalId({
            entityType: "HEALTH_RECORD",
            localId,
          }) ||
          localId;

        serverPayload = {
          ...serverPayload,
          id: realHealthRecordId,
        };

        /**
         * Health Record may contain a Visit ID.
         *
         * If the Visit was created offline,
         * its ID may still be LOCAL_VISIT_xxx.
         *
         * First check current sync mappings,
         * then persistent IndexedDB mapping.
         */
        if (serverPayload.visitId) {

          const mappedVisitId =
            idMappings.visits[
              serverPayload.visitId
            ] ||
            await getServerIdFromLocalId({
              entityType: "VISIT",
              localId:
                serverPayload.visitId,
            });

          if (mappedVisitId) {

            serverPayload = {
              ...serverPayload,
              visitId: mappedVisitId,
            };
          }
        }

        /*
         * Update Health Record on backend
         */
        result =
          await healthRecordService
            .updateHealthRecord(
              realHealthRecordId,
              serverPayload
            );
      }

      // ---------------------------------------------------
      // HEALTH RECORD DELETE
      // ---------------------------------------------------

      else if (
        operationType === "DELETE"
      ) {

        /*
         * Convert temporary Health Record ID
         * to real backend ID if mapping exists.
         */
        const realHealthRecordId =
          idMappings.healthRecords[
            localId
          ] ||
          await getServerIdFromLocalId({
            entityType: "HEALTH_RECORD",
            localId,
          }) ||
          localId;

        try {

          /*
           * Delete Health Record from backend
           */
          result =
            await healthRecordService
              .deleteHealthRecord(
                realHealthRecordId
              );

        } catch (error) {

          /*
           * If the Health Record is already deleted
           * on the backend, DELETE has effectively
           * succeeded.
           */
          if (
            error?.response?.status === 404
          ) {
            result = null;
          } else {
            throw error;
          }
        }

        /*
         * Backend DELETE succeeded OR the Health Record
         * was already absent from the backend.
         *
         * Now remove the local PENDING_DELETE record.
         */
        await db.healthRecords.delete(
          localId
        );
      }

      // ---------------------------------------------------
      // UNSUPPORTED HEALTH RECORD OPERATION
      // ---------------------------------------------------

      else {
        throw new Error(
          `Unsupported HEALTH_RECORD operation: ${operationType}`
        );
      }
    }

    // =====================================================
    // UNKNOWN ENTITY
    // =====================================================

    else {
      throw new Error(
        `Unsupported entity type: ${entityType}`
      );
    }

    /*
     * Operation completed successfully.
     */
    await markSynced(id);

    return {
      success: true,
      operation,
      result,
    };

  } catch (error) {

    const errorMessage =
      error?.apiError?.message ||
      error?.message ||
      "Sync operation failed.";

    /*
     * Keep the operation in the queue as FAILED.
     * It can be retried later.
     */
    await markSyncFailed(
      id,
      errorMessage
    );

    return {
      success: false,
      operation,
      error: errorMessage,
    };
  }
};

/**
 * Check whether a CREATE operation for the same
 * entity and local ID has already failed during
 * the current sync run.
 */
const hasFailedCreate = (
  failedCreates,
  entityType,
  localId
) => {
  return failedCreates.has(
    `${entityType}:${localId}`
  );
};

/**
 * Sync all pending operations.
 */
export const syncPendingOperations =
  async () => {

    const operations =
      await getPendingSyncOperations();

    /*
     * Nothing to sync.
     */
    if (!operations.length) {

      return {
        success: true,
        total: 0,
        synced: 0,
        failed: 0,
      };
    }

    let synced = 0;
    let failed = 0;

    /**
     * Keeps track of temporary local IDs
     * and their corresponding server IDs.
     *
     * Example:
     *
     * {
     *   visits: {
     *     "LOCAL_VISIT_xxx":
     *       "6aa6eb665eb75241ccb9e86e"
     *   },
     *
     *   healthRecords: {
     *     "LOCAL_HEALTH_xxx":
     *       "6aa6ec3d5eb75241ccb9e870"
     *   }
     * }
     */
    const idMappings = {
      visits: {},
      healthRecords: {},
    };

    /**
     * Keeps track of CREATE operations that
     * failed during this sync run.
     *
     * Example:
     *
     * HEALTH_RECORD:LOCAL_HEALTH_xxx
     *
     * If CREATE fails, later UPDATE/DELETE
     * operations for the same local ID will
     * not be sent to the backend.
     */
    const failedCreates = new Set();

    /**
     * Operations are already sorted by createdAt
     * in getPendingSyncOperations().
     *
     * Therefore:
     *
     * VISIT CREATE
     *      ↓
     * local Visit ID → server Visit ID
     *      ↓
     * HEALTH RECORD CREATE
     *      ↓
     * local visitId → server visitId
     */
    for (
      const operation of operations
    ) {

      const {
        entityType,
        operation: operationType,
        localId,
      } = operation;

      /*
       * ---------------------------------------------------
       * CHECK DEPENDENCY
       * ---------------------------------------------------
       *
       * If CREATE for this local record already failed,
       * don't send UPDATE or DELETE to the backend.
       */
      if (
        operationType !== "CREATE" &&
        hasFailedCreate(
          failedCreates,
          entityType,
          localId
        )
      ) {

        const dependencyError =
          `Skipped because the original ${entityType} CREATE operation failed.`;

        await markSyncFailed(
          operation.id,
          dependencyError
        );

        failed++;

        console.log(
          "SYNC OPERATION SKIPPED:",
          {
            entityType,
            operation: operationType,
            localId,
            reason: dependencyError,
          }
        );

        continue;
      }

      /*
       * ---------------------------------------------------
       * PROCESS OPERATION
       * ---------------------------------------------------
       */
      const result =
        await processSyncOperation(
          operation,
          idMappings
        );

      if (result.success) {

        synced++;

      } else {

        failed++;

        /*
         * If CREATE failed, remember it.
         *
         * Any later UPDATE/DELETE for this same
         * local record will be skipped.
         */
        if (
          operationType === "CREATE"
        ) {

          failedCreates.add(
            `${entityType}:${localId}`
          );

          console.log(
            "CREATE FAILED:",
            {
              entityType,
              localId,
              error: result.error,
            }
          );
        }
      }
    }

    return {
      success: failed === 0,
      total: operations.length,
      synced,
      failed,
    };
  };