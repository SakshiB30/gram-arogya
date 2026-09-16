import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import db from "../../offline/db";

import healthRecordService from "../../services/healthRecordService";

import {
  saveHealthRecordOffline,
  createOfflineHealthRecord,
  getOfflineHealthRecords,
  getOfflineHealthRecordById,
  getOfflineHealthRecordsByBeneficiary,
  getOfflineHealthRecordsByVisit,
  updateOfflineHealthRecord,
  deleteOfflineHealthRecord,
} from "../../offline/healthRecordOfflineService";

import {
  addToSyncQueue,
} from "../../offline/syncQueueService";

import { isOnline } from "../../offline/network";

/*
 * Convert different API error formats into
 * one simple error message.
 */
const normalizeApiError = (error) => {
  if (!error) {
    return "Something went wrong.";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.response?.data) {
    const data = error.response.data;

    if (typeof data === "string") {
      return data;
    }

    if (data.message) {
      return data.message;
    }

    if (data.error) {
      return data.error;
    }

    if (data.errors) {
      if (Array.isArray(data.errors)) {
        return data.errors.join(", ");
      }

      if (typeof data.errors === "object") {
        return Object.values(data.errors)
          .flat()
          .join(", ");
      }
    }
  }

  return (
    error.message ||
    "Something went wrong."
  );
};

/*
 * Generate a temporary ID for a health record
 * created while offline.
 *
 * This ID exists only in IndexedDB until the
 * backend gives us the real MongoDB ID.
 */
const generateLocalHealthRecordId = () => {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return `LOCAL_HEALTH_${crypto.randomUUID()}`;
  }

  return `LOCAL_HEALTH_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 10)}`;
};

/*
 * Generate a unique operation ID for the sync queue.
 */
const generateOperationId = () => {
  if (
    typeof crypto !== "undefined" &&
    crypto.randomUUID
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 10)}`;
};

/*
 * FETCH ALL HEALTH RECORDS
 *
 * ONLINE:
 *   GET /health-records
 *   Save returned records into IndexedDB.
 *
 * OFFLINE:
 *   Read records from IndexedDB.
 */

export const fetchHealthRecords =
  createAsyncThunk(
    "healthRecords/fetchHealthRecords",
    async (_, { rejectWithValue }) => {
      try {
        if (isOnline()) {
          /*
           * Fetch up to 50 health records from backend.
           *
           * Backend allows maximum size = 50.
           *
           * Previously this used the default:
           *
           * page = 0
           * size = 10
           *
           * which meant only the first 10 records
           * were displayed.
           */
          const response =
            await healthRecordService.getAllHealthRecords(
              0,
              50
            );

          /*
           * Backend returns a Spring Page:
           *
           * {
           *   content: [...],
           *   totalElements: ...,
           *   totalPages: ...
           * }
           *
           * Extract the actual records.
           */
          const records = Array.isArray(response)
            ? response
            : response?.content || [];

          /*
           * Save server records into IndexedDB.
           */
          for (const record of records) {
            await saveHealthRecordOffline({
              ...record,
              syncStatus: "SYNCED",
              isOffline: false,
            });
          }

          return records;
        }

        /*
         * OFFLINE:
         *
         * Read all locally stored health records.
         */
        return await getOfflineHealthRecords();

      } catch (error) {
        /*
         * If the online request fails,
         * fall back to IndexedDB.
         */
        try {
          const offlineRecords =
            await getOfflineHealthRecords();

          if (offlineRecords.length > 0) {
            return offlineRecords;
          }
        } catch (offlineError) {
          console.error(
            "Failed to load offline health records:",
            offlineError
          );
        }

        return rejectWithValue(
          normalizeApiError(error)
        );
      }
    }
  );


/*
 * FETCH HEALTH RECORD BY ID
 */
export const fetchHealthRecordById =
  createAsyncThunk(
    "healthRecords/fetchHealthRecordById",
    async (id, { rejectWithValue }) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Health Record ID is required."
          );
        }

        if (isOnline()) {
          const record =
            await healthRecordService.getHealthRecordById(
              id
            );

          if (record) {
            await saveHealthRecordOffline({
              ...record,
              syncStatus: "SYNCED",
              isOffline: false,
            });
          }

          return record;
        }

        /*
         * Offline lookup.
         */
        const record =
          await getOfflineHealthRecordById(id);

        if (!record) {
          throw new Error(
            "Health record not found offline."
          );
        }

        return record;
      } catch (error) {
        /*
         * Try local data if online request fails.
         */
        try {
          const offlineRecord =
            await getOfflineHealthRecordById(id);

          if (offlineRecord) {
            return offlineRecord;
          }
        } catch (offlineError) {
          console.error(
            "Failed to get offline health record:",
            offlineError
          );
        }

        return rejectWithValue(
          normalizeApiError(error)
        );
      }
    }
  );

/*
 * FETCH HEALTH RECORDS BY BENEFICIARY
 */
export const fetchHealthRecordsByBeneficiary =
  createAsyncThunk(
    "healthRecords/fetchByBeneficiary",
    async (
      beneficiaryId,
      { rejectWithValue }
    ) => {
      try {
        if (!beneficiaryId) {
          return rejectWithValue(
            "Beneficiary ID is required."
          );
        }

        if (isOnline()) {
          const records =
            await healthRecordService.getHealthRecordsByBeneficiary(
              beneficiaryId
            );

          const healthRecords =
            Array.isArray(records)
              ? records
              : records?.content || [];

          for (const record of healthRecords) {
            await saveHealthRecordOffline({
              ...record,
              syncStatus: "SYNCED",
              isOffline: false,
            });
          }

          return healthRecords;
        }

        return await getOfflineHealthRecordsByBeneficiary(
          beneficiaryId
        );
      } catch (error) {
        try {
          return await getOfflineHealthRecordsByBeneficiary(
            beneficiaryId
          );
        } catch (offlineError) {
          console.error(
            "Failed to load offline beneficiary health records:",
            offlineError
          );
        }

        return rejectWithValue(
          normalizeApiError(error)
        );
      }
    }
  );

/*
 * FETCH HEALTH RECORDS BY VISIT
 */
export const fetchHealthRecordsByVisit =
  createAsyncThunk(
    "healthRecords/fetchByVisit",
    async (visitId, { rejectWithValue }) => {
      try {
        if (!visitId) {
          return rejectWithValue(
            "Visit ID is required."
          );
        }

        if (isOnline()) {
          const records =
            await healthRecordService.getHealthRecordsByVisit(
              visitId
            );

          const healthRecords =
            Array.isArray(records)
              ? records
              : records?.content || [];

          for (const record of healthRecords) {
            await saveHealthRecordOffline({
              ...record,
              syncStatus: "SYNCED",
              isOffline: false,
            });
          }

          return healthRecords;
        }

        return await getOfflineHealthRecordsByVisit(
          visitId
        );
      } catch (error) {
        try {
          return await getOfflineHealthRecordsByVisit(
            visitId
          );
        } catch (offlineError) {
          console.error(
            "Failed to load offline visit health records:",
            offlineError
          );
        }

        return rejectWithValue(
          normalizeApiError(error)
        );
      }
    }
  );

/*
 * CREATE HEALTH RECORD
 *
 * ONLINE:
 *   Send directly to backend.
 *
 * OFFLINE:
 *   1. Generate LOCAL_HEALTH_xxx
 *   2. Save to IndexedDB
 *   3. Add CREATE operation to sync queue
 */
export const createHealthRecord =
  createAsyncThunk(
    "healthRecords/createHealthRecord",
    async (healthRecord, { rejectWithValue }) => {
      try {
        if (!healthRecord) {
          return rejectWithValue(
            "Health record data is required."
          );
        }

        /*
         * ONLINE CREATE
         */
        if (isOnline()) {
          const createdRecord =
            await healthRecordService.createHealthRecord(
              healthRecord
            );

          /*
           * Store the server version locally.
           */
          if (createdRecord) {
            await saveHealthRecordOffline({
              ...createdRecord,
              syncStatus: "SYNCED",
              isOffline: false,
            });
          }

          return createdRecord;
        }

        /*
         * OFFLINE CREATE
         */
        const localId =
          generateLocalHealthRecordId();

        const now =
          new Date().toISOString();

        const localHealthRecord = {
          ...healthRecord,

          id: localId,

          syncStatus: "PENDING",

          isOffline: true,

          createdAt: now,

          updatedAt: now,
        };

        /*
         * Save the health record locally.
         */
        await createOfflineHealthRecord(
          localHealthRecord
        );

        /*
         * Add CREATE operation to sync queue.
         */
        await addToSyncQueue({
          operationId:
            generateOperationId(),

          entityType:
            "HEALTH_RECORD",

          operation:
            "CREATE",

          localId,

          payload: localHealthRecord,
        });

        return localHealthRecord;
      } catch (error) {
        return rejectWithValue(
          normalizeApiError(error)
        );
      }
    }
  );

/*
 * UPDATE HEALTH RECORD
 *
 * ONLINE:
 *   PUT /health-records/{id}
 *
 * OFFLINE:
 *   1. Update IndexedDB
 *   2. Mark PENDING
 *   3. Add UPDATE operation
 */
export const updateHealthRecord =
  createAsyncThunk(
    "healthRecords/updateHealthRecord",
    async (
      { id, healthRecord },
      { rejectWithValue }
    ) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Health Record ID is required."
          );
        }

        if (!healthRecord) {
          return rejectWithValue(
            "Health record data is required."
          );
        }

        /*
         * ONLINE UPDATE
         */
        if (isOnline()) {
          const updatedRecord =
            await healthRecordService.updateHealthRecord(
              id,
              healthRecord
            );

          if (updatedRecord) {
            await saveHealthRecordOffline({
              ...updatedRecord,
              syncStatus: "SYNCED",
              isOffline: false,
            });
          }

          return updatedRecord;
        }

        /*
         * OFFLINE UPDATE
         */
        const updatedRecord =
          await updateOfflineHealthRecord(
            id,
            healthRecord
          );

        /*
         * Add UPDATE operation.
         */
        await addToSyncQueue({
          operationId:
            generateOperationId(),

          entityType:
            "HEALTH_RECORD",

          operation:
            "UPDATE",

          localId: id,

          payload: updatedRecord,
        });

        return updatedRecord;
      } catch (error) {
        return rejectWithValue(
          normalizeApiError(error)
        );
      }
    }
  );

/*
 * DELETE HEALTH RECORD
 *
 * ONLINE:
 *   Delete directly from backend.
 *
 * OFFLINE:
 *
 *   LOCAL_HEALTH_xxx:
 *       remove locally
 *       remove pending CREATE
 *
 *   SERVER ID:
 *       mark PENDING_DELETE
 *       add DELETE operation
 */
export const deleteHealthRecord =
  createAsyncThunk(
    "healthRecords/deleteHealthRecord",
    async (id, { rejectWithValue }) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Health Record ID is required."
          );
        }

        /*
         * ONLINE DELETE
         */
        if (isOnline()) {
          await healthRecordService.deleteHealthRecord(
            id
          );

          /*
           * Remove local copy after successful
           * backend deletion.
           */
          await db.healthRecords.delete(id);

          return id;
        }

        /*
         * OFFLINE DELETE
         */
        const isLocalHealthRecord =
          typeof id === "string" &&
          id.startsWith(
            "LOCAL_HEALTH_"
          );

        if (isLocalHealthRecord) {
          /*
           * This record has never reached backend.
           *
           * Therefore no DELETE API call is required.
           */
          await db.healthRecords.delete(id);

          /*
           * Remove its pending CREATE operation.
           *
           * We intentionally do NOT remove unrelated
           * queue operations here.
           */
          const createOperations =
            await db.syncQueue
              .where("entityType")
              .equals("HEALTH_RECORD")
              .filter(
                (operation) =>
                  operation.operation ===
                    "CREATE" &&
                  operation.localId === id
              )
              .toArray();

          for (const operation of createOperations) {
            await db.syncQueue.delete(
              operation.id
            );
          }

          /*
           * Also remove any UPDATE operations
           * belonging to this local-only record.
           *
           * This prevents:
           *
           * CREATE
           * UPDATE
           *
           * from remaining in the queue after
           * the record itself has been deleted.
           */
          const updateOperations =
            await db.syncQueue
              .where("entityType")
              .equals("HEALTH_RECORD")
              .filter(
                (operation) =>
                  operation.operation ===
                    "UPDATE" &&
                  operation.localId === id
              )
              .toArray();

          for (const operation of updateOperations) {
            await db.syncQueue.delete(
              operation.id
            );
          }

          return {
            id,
            syncStatus:
              "LOCAL_DELETED",
            isOffline: true,
          };
        }

        /*
         * Existing server record.
         *
         * Mark it PENDING_DELETE locally.
         */
        const deletedRecord =
          await deleteOfflineHealthRecord(
            id
          );

        /*
         * Add DELETE operation.
         */
        await addToSyncQueue({
          operationId:
            generateOperationId(),

          entityType:
            "HEALTH_RECORD",

          operation:
            "DELETE",

          localId: id,

          payload: deletedRecord,
        });

        return deletedRecord;
      } catch (error) {
        return rejectWithValue(
          normalizeApiError(error)
        );
      }
    }
  );

/*
 * INITIAL STATE
 */
const initialState = {
  healthRecords: [],

  selectedHealthRecord: null,

  loading: false,

  error: null,

  actionLoading: false,

  actionError: null,
};

/*
 * SLICE
 */
const healthRecordSlice =
  createSlice({
    name: "healthRecords",

    initialState,

    reducers: {
      clearHealthRecordError: (
        state
      ) => {
        state.error = null;
        state.actionError = null;
      },

      clearSelectedHealthRecord: (
        state
      ) => {
        state.selectedHealthRecord =
          null;
      },

      setSelectedHealthRecord: (
        state,
        action
      ) => {
        state.selectedHealthRecord =
          action.payload;
      },
    },

    extraReducers: (builder) => {
      /*
       * FETCH ALL
       */
      builder

        .addCase(
          fetchHealthRecords.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchHealthRecords.fulfilled,
          (state, action) => {
            state.loading = false;
            state.error = null;

            state.healthRecords =
              action.payload || [];
          }
        )

        .addCase(
          fetchHealthRecords.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch health records.";
          }
        );

      /*
       * FETCH BY ID
       */
      builder

        .addCase(
          fetchHealthRecordById.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchHealthRecordById.fulfilled,
          (state, action) => {
            state.loading = false;
            state.error = null;

            state.selectedHealthRecord =
              action.payload;

            /*
             * Keep the Redux list updated.
             */
            const index =
              state.healthRecords.findIndex(
                (record) =>
                  record.id ===
                  action.payload?.id
              );

            if (
              index !== -1 &&
              action.payload
            ) {
              state.healthRecords[index] =
                action.payload;
            }
          }
        )

        .addCase(
          fetchHealthRecordById.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch health record.";
          }
        );

      /*
       * FETCH BY BENEFICIARY
       */
      builder

        .addCase(
          fetchHealthRecordsByBeneficiary.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchHealthRecordsByBeneficiary.fulfilled,
          (state, action) => {
            state.loading = false;
            state.error = null;

            state.healthRecords =
              action.payload || [];
          }
        )

        .addCase(
          fetchHealthRecordsByBeneficiary.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch beneficiary health records.";
          }
        );

      /*
       * FETCH BY VISIT
       */
      builder

        .addCase(
          fetchHealthRecordsByVisit.pending,
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )

        .addCase(
          fetchHealthRecordsByVisit.fulfilled,
          (state, action) => {
            state.loading = false;
            state.error = null;

            state.healthRecords =
              action.payload || [];
          }
        )

        .addCase(
          fetchHealthRecordsByVisit.rejected,
          (state, action) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch visit health records.";
          }
        );

      /*
       * CREATE
       */
      builder

        .addCase(
          createHealthRecord.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
          }
        )

        .addCase(
          createHealthRecord.fulfilled,
          (state, action) => {
            state.actionLoading = false;
            state.actionError = null;

            /*
             * Add new record to Redux.
             */
            state.healthRecords.push(
              action.payload
            );

            state.selectedHealthRecord =
              action.payload;
          }
        )

        .addCase(
          createHealthRecord.rejected,
          (state, action) => {
            state.actionLoading = false;

            state.actionError =
              action.payload ||
              "Failed to create health record.";
          }
        );

      /*
       * UPDATE
       */
      builder

        .addCase(
          updateHealthRecord.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
          }
        )

        .addCase(
          updateHealthRecord.fulfilled,
          (state, action) => {
            state.actionLoading = false;
            state.actionError = null;

            const index =
              state.healthRecords.findIndex(
                (record) =>
                  record.id ===
                  action.payload?.id
              );

            if (index !== -1) {
              state.healthRecords[index] =
                action.payload;
            } else {
              state.healthRecords.push(
                action.payload
              );
            }

            state.selectedHealthRecord =
              action.payload;
          }
        )

        .addCase(
          updateHealthRecord.rejected,
          (state, action) => {
            state.actionLoading = false;

            state.actionError =
              action.payload ||
              "Failed to update health record.";
          }
        );

      /*
       * DELETE
       */
      builder

        .addCase(
          deleteHealthRecord.pending,
          (state) => {
            state.actionLoading = true;
            state.actionError = null;
          }
        )

        .addCase(
          deleteHealthRecord.fulfilled,
          (state, action) => {
            state.actionLoading = false;
            state.actionError = null;

            const deletedId =
              action.payload?.id ||
              action.payload;

            /*
             * If the record was deleted offline,
             * remove local-only records immediately.
             *
             * For server records marked
             * PENDING_DELETE, keeping it in Redux
             * temporarily is useful for sync state.
             */
            if (
              action.payload?.syncStatus ===
              "PENDING_DELETE"
            ) {
              const index =
                state.healthRecords.findIndex(
                  (record) =>
                    record.id ===
                    deletedId
                );

              if (index !== -1) {
                state.healthRecords[index] =
                  action.payload;
              }
            } else {
              state.healthRecords =
                state.healthRecords.filter(
                  (record) =>
                    record.id !==
                    deletedId
                );
            }

            if (
              state.selectedHealthRecord
                ?.id === deletedId
            ) {
              state.selectedHealthRecord =
                null;
            }
          }
        )

        .addCase(
          deleteHealthRecord.rejected,
          (state, action) => {
            state.actionLoading = false;

            state.actionError =
              action.payload ||
              "Failed to delete health record.";
          }
        );
    },
  });

export const {
  clearHealthRecordError,
  clearSelectedHealthRecord,
  setSelectedHealthRecord,
} =
  healthRecordSlice.actions;

export default healthRecordSlice.reducer;
