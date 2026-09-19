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
 * Remove IndexedDB-only fields before sending
 * data to the backend.
 */
const cleanPayload = (payload, operationType) => {
  if (!payload) {
    return {};
  }

  const {
    syncStatus,
    isOffline,
    createdAt,
    updatedAt,
    ...serverPayload
  } = payload;

  /**
   * CREATE operations use a temporary local ID.
   * Backend must generate the real MongoDB ID.
   */
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
 * Resolve a local Visit ID to its real backend Visit ID.
 */
const resolveVisitServerId = async (
  localVisitId,
  idMappings
) => {
  if (!localVisitId) {
    return null;
  }

  /**
   * Already resolved during this sync session.
   */
  if (idMappings.visits[localVisitId]) {
    return idMappings.visits[localVisitId];
  }

  /**
   * Check persistent IndexedDB mapping.
   */
  const mappedServerId =
    await getServerIdFromLocalId({
      entityType: "VISIT",
      localId: localVisitId,
    });

  if (mappedServerId) {
    return mappedServerId;
  }

  return null;
};

/**
 * Process one sync operation.
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

    let serverPayload =
      cleanPayload(
        payload,
        operationType
      );

    let result;

    // =========================================================
    // VISIT
    // =========================================================

    if (entityType === "VISIT") {

      // -------------------------------------------------------
      // CREATE VISIT
      // -------------------------------------------------------

      if (operationType === "CREATE") {

        result =
          await visitService.createVisit(
            serverPayload
          );

        if (!result?.id) {
          throw new Error(
            "Backend did not return a Visit ID."
          );
        }

        /**
         * Store local → server mapping.
         */
        idMappings.visits[localId] =
          result.id;

        await saveSyncMapping({
          entityType: "VISIT",
          localId,
          serverId: result.id,
        });

        /**
         * Replace local Visit with server Visit.
         */
        const localVisit =
          await db.visits.get(localId);

        if (localVisit) {
          const updatedVisit = {
            ...localVisit,
            ...result,
            id: result.id,
            syncStatus: "SYNCED",
            isOffline: false,
          };

          await db.visits.delete(
            localId
          );

          await db.visits.put(
            updatedVisit
          );
        }
      }

      // -------------------------------------------------------
      // UPDATE VISIT
      // -------------------------------------------------------

      else if (
        operationType === "UPDATE"
      ) {

        const realVisitId =
          await resolveVisitServerId(
            localId,
            idMappings
          );

        if (!realVisitId) {
          throw new Error(
            `Cannot update Visit. Server ID not found for local Visit ${localId}.`
          );
        }

        /**
         * Do not send local IndexedDB ID.
         */
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

      // -------------------------------------------------------
      // DELETE VISIT
      // -------------------------------------------------------

      else if (
        operationType === "DELETE"
      ) {

        const realVisitId =
          await resolveVisitServerId(
            localId,
            idMappings
          );

        if (!realVisitId) {
          /**
           * If the Visit never reached backend,
           * there is nothing to delete remotely.
           */
          await db.visits.delete(
            localId
          );

          return {
            success: true,
            operation,
            result: null,
          };
        }

        try {
          result =
            await visitService.deleteVisit(
              realVisitId
            );
        } catch (error) {

          /**
           * Already deleted on backend.
           */
          if (
            error?.response?.status === 404
          ) {
            result = null;
          } else {
            throw error;
          }
        }

        await db.visits.delete(
          localId
        );
      }

      else {
        throw new Error(
          `Unsupported VISIT operation: ${operationType}`
        );
      }
    }

    // =========================================================
    // HEALTH RECORD
    // =========================================================

    else if (
      entityType === "HEALTH_RECORD"
    ) {

      // -------------------------------------------------------
      // CREATE HEALTH RECORD
      // -------------------------------------------------------

      if (
        operationType === "CREATE"
      ) {

        /**
         * Health Record MUST have a Visit.
         */
        if (!serverPayload.visitId) {
          throw new Error(
            "Health Record cannot be synchronized without a Visit ID."
          );
        }

        const localVisitId =
          serverPayload.visitId;

        /**
         * IMPORTANT:
         *
         * If Health Record points to a local Visit,
         * that Visit must be synchronized first.
         */
        const mappedVisitId =
          await resolveVisitServerId(
            localVisitId,
            idMappings
          );

        /**
         * No server Visit yet.
         */
        if (!mappedVisitId) {

          /**
           * This is expected when the Visit CREATE
           * has not completed yet.
           */
          if (
            typeof localVisitId ===
              "string" &&
            localVisitId.startsWith(
              "LOCAL_VISIT_"
            )
          ) {
            throw new Error(
              `Visit ${localVisitId} has not been synchronized yet.`
            );
          }

          /**
           * If it is not a local Visit ID,
           * assume it is already a server ID.
           */
        } else {

          /**
           * Replace local Visit ID
           * with real backend Visit ID.
           */
          serverPayload = {
            ...serverPayload,
            visitId: mappedVisitId,
          };
        }

        /**
         * Final protection:
         *
         * Never send LOCAL_VISIT_* to backend.
         */
        if (
          typeof serverPayload.visitId ===
            "string" &&
          serverPayload.visitId.startsWith(
            "LOCAL_VISIT_"
          )
        ) {
          throw new Error(
            `Visit ${serverPayload.visitId} is still waiting for synchronization.`
          );
        }

        /**
         * Now create Health Record.
         */
        result =
          await healthRecordService.createHealthRecord(
            serverPayload
          );

        if (!result?.id) {
          throw new Error(
            "Backend did not return a Health Record ID."
          );
        }

        /**
         * Store local Health Record
         * → server Health Record mapping.
         */
        idMappings.healthRecords[
          localId
        ] = result.id;

        await saveSyncMapping({
          entityType:
            "HEALTH_RECORD",
          localId,
          serverId: result.id,
        });

        /**
         * Replace local Health Record
         * with server Health Record.
         */
        const localHealthRecord =
          await db.healthRecords.get(
            localId
          );

        if (localHealthRecord) {

          const updatedHealthRecord = {
            ...localHealthRecord,
            ...result,
            id: result.id,
            syncStatus: "SYNCED",
            isOffline: false,
          };

          await db.healthRecords.delete(
            localId
          );

          await db.healthRecords.put(
            updatedHealthRecord
          );
        }
      }

      // -------------------------------------------------------
      // UPDATE HEALTH RECORD
      // -------------------------------------------------------

      else if (
        operationType === "UPDATE"
      ) {

        const realHealthRecordId =
          idMappings.healthRecords[
            localId
          ] ||
          await getServerIdFromLocalId({
            entityType:
              "HEALTH_RECORD",
            localId,
          });

        if (!realHealthRecordId) {
          throw new Error(
            `Cannot update Health Record. Server ID not found for local Health Record ${localId}.`
          );
        }

        serverPayload = {
          ...serverPayload,
          id: realHealthRecordId,
        };

        /**
         * Resolve Visit ID if necessary.
         */
        if (serverPayload.visitId) {

          const mappedVisitId =
            await resolveVisitServerId(
              serverPayload.visitId,
              idMappings
            );

          if (
            mappedVisitId
          ) {
            serverPayload = {
              ...serverPayload,
              visitId:
                mappedVisitId,
            };
          }
        }

        /**
         * Never send local Visit ID.
         */
        if (
          typeof serverPayload.visitId ===
            "string" &&
          serverPayload.visitId.startsWith(
            "LOCAL_VISIT_"
          )
        ) {
          throw new Error(
            `Cannot update Health Record because Visit ${serverPayload.visitId} is not synchronized yet.`
          );
        }

        result =
          await healthRecordService.updateHealthRecord(
            realHealthRecordId,
            serverPayload
          );
      }

      // -------------------------------------------------------
      // DELETE HEALTH RECORD
      // -------------------------------------------------------

      else if (
        operationType === "DELETE"
      ) {

        const realHealthRecordId =
          idMappings.healthRecords[
            localId
          ] ||
          await getServerIdFromLocalId({
            entityType:
              "HEALTH_RECORD",
            localId,
          });

        /**
         * If it was only created offline
         * and never synced, simply remove it locally.
         */
        if (!realHealthRecordId) {

          await db.healthRecords.delete(
            localId
          );

          return {
            success: true,
            operation,
            result: null,
          };
        }

        try {

          result =
            await healthRecordService.deleteHealthRecord(
              realHealthRecordId
            );

        } catch (error) {

          if (
            error?.response?.status === 404
          ) {
            result = null;
          } else {
            throw error;
          }
        }

        await db.healthRecords.delete(
          localId
        );
      }

      else {
        throw new Error(
          `Unsupported HEALTH_RECORD operation: ${operationType}`
        );
      }
    }

    else {
      throw new Error(
        `Unsupported entity type: ${entityType}`
      );
    }

    await markSynced(id);

    return {
      success: true,
      operation,
      result,
    };

  } catch (error) {

    const errorMessage =
      error?.apiError?.message ||
      error?.response?.data?.message ||
      error?.message ||
      "Sync operation failed.";

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
 * Check whether a CREATE operation failed.
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
     * Runtime mappings created during
     * this synchronization session.
     */
    const idMappings = {
      visits: {},
      healthRecords: {},
    };

    /**
     * Track failed CREATE operations.
     */
    const failedCreates =
      new Set();

    /**
     * ---------------------------------------------------------
     * IMPORTANT:
     *
     * Sort operations so that:
     *
     * VISIT CREATE
     * comes before
     * HEALTH_RECORD CREATE
     *
     * This guarantees dependency order.
     * ---------------------------------------------------------
     */

    const entityPriority = {
      VISIT: 1,
      HEALTH_RECORD: 2,
    };

    const operationPriority = {
      CREATE: 1,
      UPDATE: 2,
      DELETE: 3,
    };

    const sortedOperations =
      [...operations].sort(
        (a, b) => {

          /**
           * First sort by entity.
           */
          const entityDifference =
            (entityPriority[
              a.entityType
            ] || 99) -
            (entityPriority[
              b.entityType
            ] || 99);

          if (
            entityDifference !== 0
          ) {
            return entityDifference;
          }

          /**
           * Then CREATE → UPDATE → DELETE.
           */
          const operationDifference =
            (operationPriority[
              a.operation
            ] || 99) -
            (operationPriority[
              b.operation
            ] || 99);

          if (
            operationDifference !== 0
          ) {
            return operationDifference;
          }

          /**
           * Finally preserve creation order.
           */
          return (
            new Date(
              a.createdAt
            ).getTime() -
            new Date(
              b.createdAt
            ).getTime()
          );
        }
      );

    console.log(
      "SYNC OPERATIONS ORDER:",
      sortedOperations.map(
        (operation) => ({
          id: operation.id,
          entityType:
            operation.entityType,
          operation:
            operation.operation,
          localId:
            operation.localId,
        })
      )
    );

    /**
     * ---------------------------------------------------------
     * PROCESS OPERATIONS
     * ---------------------------------------------------------
     */

    for (
      const operation
      of sortedOperations
    ) {

      const {
        entityType,
        operation: operationType,
        localId,
      } = operation;

      /**
       * If a CREATE operation failed,
       * don't process dependent operations.
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
            operation:
              operationType,
            localId,
            reason:
              dependencyError,
          }
        );

        continue;
      }

      /**
       * Special protection for Health Record.
       *
       * If it depends on a local Visit,
       * verify the Visit mapping before processing.
       */
      if (
        entityType ===
          "HEALTH_RECORD" &&
        operationType ===
          "CREATE"
      ) {

        const visitId =
          operation.payload?.visitId;

        if (
          typeof visitId ===
            "string" &&
          visitId.startsWith(
            "LOCAL_VISIT_"
          )
        ) {

          const mappedVisitId =
            await resolveVisitServerId(
              visitId,
              idMappings
            );

          /**
           * Visit is not synced yet.
           */
          if (!mappedVisitId) {

            const dependencyError =
              `Skipped Health Record because Visit ${visitId} has not been synchronized yet.`;

            await markSyncFailed(
              operation.id,
              dependencyError
            );

            failed++;

            console.log(
              "HEALTH RECORD WAITING FOR VISIT:",
              {
                healthRecord:
                  localId,
                visitId,
              }
            );

            continue;
          }
        }
      }

      const result =
        await processSyncOperation(
          operation,
          idMappings
        );

      if (result.success) {

        synced++;

      } else {

        failed++;

        if (
          operationType ===
          "CREATE"
        ) {

          failedCreates.add(
            `${entityType}:${localId}`
          );

          console.log(
            "CREATE FAILED:",
            {
              entityType,
              localId,
              error:
                result.error,
            }
          );
        }
      }
    }

    return {
      success:
        failed === 0,
      total:
        operations.length,
      synced,
      failed,
    };
  };