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
 * Resolve a Visit ID to its real backend Visit ID.
 *
 * There are two possible situations:
 *
 * 1. The ID is a LOCAL_VISIT_xxx ID.
 *    → Find its persistent mapping.
 *
 * 2. The Visit was already synchronized.
 *    → IndexedDB and the queue may contain the real
 *      MongoDB/server ID directly.
 */
const resolveVisitServerId = async (
  visitId,
  idMappings
) => {
  if (!visitId) {
    return null;
  }

  /**
   * Already resolved during this sync session.
   */
  if (idMappings.visits[visitId]) {
    return idMappings.visits[visitId];
  }

  /**
   * Check persistent IndexedDB mapping.
   */
  const mappedServerId =
    await getServerIdFromLocalId({
      entityType: "VISIT",
      localId: visitId,
    });

  if (mappedServerId) {
    return mappedServerId;
  }

  /**
   * The Visit may already have been synchronized.
   *
   * After CREATE synchronization:
   *
   * LOCAL_VISIT_xxx
   *       ↓
   * SERVER_ID
   *
   * Therefore UPDATE/DELETE operations can contain
   * the real server ID directly.
   */
  if (
    typeof visitId === "string" &&
    !visitId.startsWith("LOCAL_VISIT_")
  ) {
    return visitId;
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

        if (!result?.id) {
          throw new Error(
            "Backend did not return a Visit ID."
          );
        }

        idMappings.visits[localId] =
          result.id;

        await saveSyncMapping({
          entityType: "VISIT",
          localId,
          serverId: result.id,
        });

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

      // ---------------------------------------------------
      // VISIT UPDATE
      // ---------------------------------------------------

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
        const realVisitId =
          await resolveVisitServerId(
            localId,
            idMappings
          );

        /**
         * If there is no server ID, this was most likely
         * a local-only Visit that had never synchronized.
         *
         * Remove it locally and mark the queue operation
         * as synchronized.
         */
        if (!realVisitId) {
          await db.visits.delete(
            localId
          );

          await markSynced(id);

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
           * If the backend says the Visit does not exist,
           * consider the delete already completed.
           */
          if (
            error?.response?.status ===
            404
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

    // =====================================================
    // HEALTH RECORD
    // =====================================================

    else if (
      entityType ===
      "HEALTH_RECORD"
    ) {

      // ---------------------------------------------------
      // CREATE HEALTH RECORD
      // ---------------------------------------------------

      if (
        operationType === "CREATE"
      ) {
        if (!serverPayload.visitId) {
          throw new Error(
            "Health Record cannot be synchronized without a Visit ID."
          );
        }

        const localVisitId =
          serverPayload.visitId;

        const mappedVisitId =
          await resolveVisitServerId(
            localVisitId,
            idMappings
          );

        if (!mappedVisitId) {
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
        } else {
          serverPayload = {
            ...serverPayload,
            visitId:
              mappedVisitId,
          };
        }

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

        result =
          await healthRecordService.createHealthRecord(
            serverPayload
          );

        if (!result?.id) {
          throw new Error(
            "Backend did not return a Health Record ID."
          );
        }

        idMappings.healthRecords[
          localId
        ] = result.id;

        await saveSyncMapping({
          entityType:
            "HEALTH_RECORD",
          localId,
          serverId: result.id,
        });

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

      // ---------------------------------------------------
      // UPDATE HEALTH RECORD
      // ---------------------------------------------------

      else if (
        operationType ===
        "UPDATE"
      ) {
        /**
         * First try the current sync-session mapping.
         */
        let realHealthRecordId =
          idMappings.healthRecords[
            localId
          ] ||
          await getServerIdFromLocalId({
            entityType:
              "HEALTH_RECORD",
            localId,
          });

        /**
         * If no mapping exists, check whether the ID
         * is already a real backend/server ID.
         *
         * After a successful CREATE sync, the local
         * IndexedDB record ID becomes the server ID.
         */
        if (
          !realHealthRecordId &&
          typeof localId === "string" &&
          !localId.startsWith(
            "LOCAL_HEALTH_"
          )
        ) {
          realHealthRecordId =
            localId;
        }

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
         * Resolve Visit ID if the Health Record
         * references an offline-created Visit.
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

      // ---------------------------------------------------
      // DELETE HEALTH RECORD
      // ---------------------------------------------------

      else if (
        operationType ===
        "DELETE"
      ) {
        /**
         * First try the current sync-session mapping.
         */
        let realHealthRecordId =
          idMappings.healthRecords[
            localId
          ] ||
          await getServerIdFromLocalId({
            entityType:
              "HEALTH_RECORD",
            localId,
          });

        /**
         * If the record has already synchronized,
         * the queue may contain the real server ID.
         */
        if (
          !realHealthRecordId &&
          typeof localId === "string" &&
          !localId.startsWith(
            "LOCAL_HEALTH_"
          )
        ) {
          realHealthRecordId =
            localId;
        }

        /**
         * Local-only Health Record that never reached
         * the backend.
         */
        if (!realHealthRecordId) {
          await db.healthRecords.delete(
            localId
          );

          await markSynced(id);

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
          /**
           * Already deleted on backend.
           */
          if (
            error?.response?.status ===
            404
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

    // =====================================================
    // UNKNOWN ENTITY
    // =====================================================

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

    const idMappings = {
      visits: {},
      healthRecords: {},
    };

    const failedCreates =
      new Set();

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
       * If a CREATE failed, dependent UPDATE/DELETE
       * operations for that same local record should
       * not be processed.
       */
      if (
        operationType !==
          "CREATE" &&
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

        console.log("SYNC OPERATION SKIPPED:", {
          entityType,
          operation: operationType,
          localId,
          reason: dependencyError,
        });

        continue;
      }

      /**
       * Health Record CREATE depends on Visit CREATE
       * when it references a LOCAL_VISIT ID.
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

          if (!mappedVisitId) {
            const dependencyError =
              `Skipped Health Record because Visit ${visitId} has not been synchronized yet.`;

            await markSyncFailed(
              operation.id,
              dependencyError
            );

            failed++;

            console.log("HEALTH RECORD WAITING FOR VISIT:", {
              healthRecord: localId,
              visitId,
            });

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

          console.log("CREATE FAILED:", {
            entityType,
            localId,
            error: result.error,
          });
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