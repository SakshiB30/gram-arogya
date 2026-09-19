import {
  createAsyncThunk,
  createSlice,
} from "@reduxjs/toolkit";

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
  removeOfflineHealthRecord,
} from "../../offline/healthRecordOfflineService";

import { addToSyncQueue } from "../../offline/syncQueueService";

import { isOnline } from "../../offline/network";

/* =========================================================
   FETCH ALL HEALTH RECORDS
========================================================= */

export const fetchHealthRecords = createAsyncThunk(
  "healthRecords/fetchHealthRecords",
  async (_, { rejectWithValue }) => {
    try {
      if (isOnline()) {
        const response =
          await healthRecordService.getAllHealthRecords(
            0,
            50
          );

        const records =
          response?.content || [];

        /*
         * Save online records locally.
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
       * Offline mode
       */
      const records =
        await getOfflineHealthRecords();

      return records;
    } catch (error) {
      console.error(
        "Failed to fetch health records:",
        error
      );

      return rejectWithValue(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch health records."
      );
    }
  }
);

/* =========================================================
   FETCH HEALTH RECORD BY ID
========================================================= */

export const fetchHealthRecordById =
  createAsyncThunk(
    "healthRecords/fetchHealthRecordById",
    async (
      id,
      { rejectWithValue }
    ) => {
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

          await saveHealthRecordOffline({
            ...record,
            syncStatus: "SYNCED",
            isOffline: false,
          });

          return record;
        }

        /*
         * Offline mode
         */
        const record =
          await getOfflineHealthRecordById(
            id
          );

        if (!record) {
          return rejectWithValue(
            "Health record not found offline."
          );
        }

        return record;
      } catch (error) {
        console.error(
          "Failed to fetch health record:",
          error
        );

        return rejectWithValue(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch health record."
        );
      }
    }
  );

/* =========================================================
   FETCH HEALTH RECORDS BY BENEFICIARY
========================================================= */

export const fetchHealthRecordsByBeneficiary =
  createAsyncThunk(
    "healthRecords/fetchHealthRecordsByBeneficiary",
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

          const recordsArray =
            Array.isArray(records)
              ? records
              : records?.content || [];

          /*
           * Save online records locally.
           */
          for (const record of recordsArray) {
            await saveHealthRecordOffline({
              ...record,
              syncStatus: "SYNCED",
              isOffline: false,
            });
          }

          return recordsArray;
        }

        /*
         * Offline mode
         */
        const records =
          await getOfflineHealthRecordsByBeneficiary(
            beneficiaryId
          );

        return records;
      } catch (error) {
        console.error(
          "Failed to fetch health records by beneficiary:",
          error
        );

        return rejectWithValue(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch health records."
        );
      }
    }
  );

/* =========================================================
   FETCH HEALTH RECORDS BY VISIT
========================================================= */

export const fetchHealthRecordsByVisit =
  createAsyncThunk(
    "healthRecords/fetchHealthRecordsByVisit",
    async (
      visitId,
      { rejectWithValue }
    ) => {
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

          const recordsArray =
            Array.isArray(records)
              ? records
              : records?.content || [];

          /*
           * Save online records locally.
           */
          for (const record of recordsArray) {
            await saveHealthRecordOffline({
              ...record,
              syncStatus: "SYNCED",
              isOffline: false,
            });
          }

          return recordsArray;
        }

        /*
         * Offline mode
         */
        const records =
          await getOfflineHealthRecordsByVisit(
            visitId
          );

        return records;
      } catch (error) {
        console.error(
          "Failed to fetch health records by visit:",
          error
        );

        return rejectWithValue(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to fetch health records."
        );
      }
    }
  );

/* =========================================================
   CREATE HEALTH RECORD
========================================================= */

export const createHealthRecord =
  createAsyncThunk(
    "healthRecords/createHealthRecord",
    async (
      healthRecord,
      {
        rejectWithValue,
        getState,
      }
    ) => {
      try {
        if (!healthRecord) {
          return rejectWithValue(
            "Health record data is required."
          );
        }

        /*
         * =============================================
         * ONLINE CREATE
         * =============================================
         */

        if (isOnline()) {
          const createdRecord =
            await healthRecordService.createHealthRecord(
              healthRecord
            );

          /*
           * Keep local IndexedDB copy updated.
           */
          await saveHealthRecordOffline({
            ...createdRecord,
            syncStatus: "SYNCED",
            isOffline: false,
          });

          return createdRecord;
        }

        /*
         * =============================================
         * OFFLINE CREATE
         * =============================================
         */

        const { user } =
          getState().auth;

        if (!user?.id) {
          return rejectWithValue(
            "ASHA user information is required for offline health record."
          );
        }

        /*
         * Generate temporary local ID.
         */
        const localHealthRecordId =
          `LOCAL_HEALTH_${crypto.randomUUID()}`;

        /*
         * Generate sync operation ID.
         */
        const operationId =
          `SYNC_HEALTH_CREATE_${crypto.randomUUID()}`;

        const now =
          new Date().toISOString();

        /*
         * Create local health record.
         */
        const offlineHealthRecord = {
          ...healthRecord,

          id: localHealthRecordId,

          ashaId: user.id,

          syncStatus: "PENDING",

          isOffline: true,

          createdAt: now,

          updatedAt: now,
        };

        /*
         * Save to IndexedDB.
         */
        await createOfflineHealthRecord(
          offlineHealthRecord
        );

        /*
         * Add CREATE operation to sync queue.
         */
        await addToSyncQueue({
          operationId,
          entityType: "HEALTH_RECORD",
          operation: "CREATE",
          localId: localHealthRecordId,
          payload: offlineHealthRecord,
          ashaId: user.id,
        });

        return offlineHealthRecord;
      } catch (error) {
        console.error(
          "Failed to create health record:",
          error
        );

        return rejectWithValue(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to create health record."
        );
      }
    }
  );

/* =========================================================
   UPDATE HEALTH RECORD
========================================================= */

export const updateHealthRecord =
  createAsyncThunk(
    "healthRecords/updateHealthRecord",
    async (
      {
        id,
        healthRecord,
      },
      {
        rejectWithValue,
        getState,
      }
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
         * =============================================
         * ONLINE UPDATE
         * =============================================
         */

        if (isOnline()) {
          const updatedRecord =
            await healthRecordService.updateHealthRecord(
              id,
              healthRecord
            );

          /*
           * Update local copy.
           */
          await saveHealthRecordOffline({
            ...updatedRecord,
            syncStatus: "SYNCED",
            isOffline: false,
          });

          return updatedRecord;
        }

        /*
         * =============================================
         * OFFLINE UPDATE
         * =============================================
         */

        const { user } =
          getState().auth;

        if (!user?.id) {
          return rejectWithValue(
            "ASHA user information is required for offline health record update."
          );
        }

        const updatedRecord =
          await updateOfflineHealthRecord(
            id,
            {
              ...healthRecord,
              ashaId: user.id,
            }
          );

        const operationId =
          `SYNC_HEALTH_UPDATE_${crypto.randomUUID()}`;

        /*
         * Add UPDATE operation.
         */
        await addToSyncQueue({
          operationId,
          entityType: "HEALTH_RECORD",
          operation: "UPDATE",
          localId: id,
          payload: updatedRecord,
          ashaId: user.id,
        });

        return updatedRecord;
      } catch (error) {
        console.error(
          "Failed to update health record:",
          error
        );

        return rejectWithValue(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to update health record."
        );
      }
    }
  );

/* =========================================================
   DELETE HEALTH RECORD
========================================================= */

export const deleteHealthRecord =
  createAsyncThunk(
    "healthRecords/deleteHealthRecord",
    async (
      id,
      {
        rejectWithValue,
        getState,
      }
    ) => {
      try {
        if (!id) {
          return rejectWithValue(
            "Health Record ID is required."
          );
        }

        /*
         * =============================================
         * ONLINE DELETE
         * =============================================
         */

        if (isOnline()) {
          await healthRecordService.deleteHealthRecord(
            id
          );

          /*
           * Remove local copy after
           * successful backend deletion.
           */
          await removeOfflineHealthRecord(
            id
          );

          return id;
        }

        /*
         * =============================================
         * OFFLINE DELETE
         * =============================================
         */

        const { user } =
          getState().auth;

        if (!user?.id) {
          return rejectWithValue(
            "ASHA user information is required for offline health record deletion."
          );
        }

        /*
         * Check whether record exists locally.
         */
        const existingRecord =
          await getOfflineHealthRecordById(
            id
          );

        if (!existingRecord) {
          return rejectWithValue(
            "Health record not found offline."
          );
        }

        /*
         * ---------------------------------------------
         * LOCAL RECORD
         * ---------------------------------------------
         *
         * A LOCAL_HEALTH record has never reached
         * the backend.
         *
         * Therefore we simply remove the local
         * record.
         *
         * NOTE:
         * We intentionally do not call
         * removePendingCreateOperations or
         * removePendingUpdateOperations because
         * those functions are not exported by
         * syncQueueService.js.
         */

        if (
          typeof id === "string" &&
          id.startsWith(
            "LOCAL_HEALTH_"
          )
        ) {
          await removeOfflineHealthRecord(
            id
          );

          return id;
        }

        /*
         * ---------------------------------------------
         * SERVER RECORD
         * ---------------------------------------------
         *
         * Backend already knows this record.
         *
         * Mark it as PENDING_DELETE locally
         * and create a DELETE sync operation.
         */

        const deletedRecord =
          await deleteOfflineHealthRecord(
            id
          );

        const operationId =
          `SYNC_HEALTH_DELETE_${crypto.randomUUID()}`;

        /*
         * Add DELETE operation.
         */
        await addToSyncQueue({
          operationId,
          entityType: "HEALTH_RECORD",
          operation: "DELETE",
          localId: id,
          payload: deletedRecord,
          ashaId: user.id,
        });

        return id;
      } catch (error) {
        console.error(
          "Failed to delete health record:",
          error
        );

        return rejectWithValue(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to delete health record."
        );
      }
    }
  );

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  healthRecords: [],

  selectedHealthRecord: null,

  loading: false,

  error: null,

  actionLoading: false,

  actionError: null,
};

/* =========================================================
   SLICE
========================================================= */

const healthRecordSlice =
  createSlice({
    name: "healthRecords",

    initialState,

    reducers: {
      clearSelectedHealthRecord: (
        state
      ) => {
        state.selectedHealthRecord =
          null;
      },

      clearHealthRecordError: (
        state
      ) => {
        state.error = null;
      },

      clearHealthRecordActionError: (
        state
      ) => {
        state.actionError = null;
      },

      clearHealthRecords: (
        state
      ) => {
        state.healthRecords = [];

        state.selectedHealthRecord =
          null;
      },
    },

    extraReducers: (builder) => {
      /* ==========================================
         FETCH ALL
      ========================================== */

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
          (
            state,
            action
          ) => {
            state.loading = false;

            state.healthRecords =
              action.payload || [];
          }
        )

        .addCase(
          fetchHealthRecords.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch health records.";
          }
        );

      /* ==========================================
         FETCH BY ID
      ========================================== */

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
          (
            state,
            action
          ) => {
            state.loading = false;

            state.selectedHealthRecord =
              action.payload;

            /*
             * Keep record inside collection.
             */
            const index =
              state.healthRecords.findIndex(
                (record) =>
                  record.id ===
                  action.payload?.id
              );

            if (index >= 0) {
              state.healthRecords[
                index
              ] = action.payload;
            } else if (
              action.payload
            ) {
              state.healthRecords.push(
                action.payload
              );
            }
          }
        )

        .addCase(
          fetchHealthRecordById.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch health record.";
          }
        );

      /* ==========================================
         FETCH BY BENEFICIARY
      ========================================== */

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
          (
            state,
            action
          ) => {
            state.loading = false;

            state.healthRecords =
              action.payload || [];
          }
        )

        .addCase(
          fetchHealthRecordsByBeneficiary.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch health records.";
          }
        );

      /* ==========================================
         FETCH BY VISIT
      ========================================== */

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
          (
            state,
            action
          ) => {
            state.loading = false;

            state.healthRecords =
              action.payload || [];
          }
        )

        .addCase(
          fetchHealthRecordsByVisit.rejected,
          (
            state,
            action
          ) => {
            state.loading = false;

            state.error =
              action.payload ||
              "Failed to fetch health records.";
          }
        );

      /* ==========================================
         CREATE
      ========================================== */

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
          (
            state,
            action
          ) => {
            state.actionLoading = false;

            const record =
              action.payload;

            /*
             * Avoid duplicate entries.
             */
            const existingIndex =
              state.healthRecords.findIndex(
                (item) =>
                  item.id ===
                  record?.id
              );

            if (
              existingIndex >= 0
            ) {
              state.healthRecords[
                existingIndex
              ] = record;
            } else {
              state.healthRecords.push(
                record
              );
            }

            state.selectedHealthRecord =
              record;
          }
        )

        .addCase(
          createHealthRecord.rejected,
          (
            state,
            action
          ) => {
            state.actionLoading = false;

            state.actionError =
              action.payload ||
              "Failed to create health record.";
          }
        );

      /* ==========================================
         UPDATE
      ========================================== */

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
          (
            state,
            action
          ) => {
            state.actionLoading = false;

            const updatedRecord =
              action.payload;

            const index =
              state.healthRecords.findIndex(
                (record) =>
                  record.id ===
                  updatedRecord?.id
              );

            if (index >= 0) {
              state.healthRecords[
                index
              ] = updatedRecord;
            } else {
              state.healthRecords.push(
                updatedRecord
              );
            }

            state.selectedHealthRecord =
              updatedRecord;
          }
        )

        .addCase(
          updateHealthRecord.rejected,
          (
            state,
            action
          ) => {
            state.actionLoading = false;

            state.actionError =
              action.payload ||
              "Failed to update health record.";
          }
        );

      /* ==========================================
         DELETE
      ========================================== */

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
          (
            state,
            action
          ) => {
            state.actionLoading = false;

            const deletedId =
              action.payload;

            state.healthRecords =
              state.healthRecords.filter(
                (record) =>
                  record.id !==
                  deletedId
              );

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
          (
            state,
            action
          ) => {
            state.actionLoading = false;

            state.actionError =
              action.payload ||
              "Failed to delete health record.";
          }
        );
    },
  });

/* =========================================================
   ACTIONS
========================================================= */

export const {
  clearSelectedHealthRecord,
  clearHealthRecordError,
  clearHealthRecordActionError,
  clearHealthRecords,
} =
  healthRecordSlice.actions;

/* =========================================================
   SELECTORS
========================================================= */

export const selectHealthRecords = (
  state
) =>
  state.healthRecords?.healthRecords ||
  [];

export const selectSelectedHealthRecord = (
  state
) =>
  state.healthRecords
    ?.selectedHealthRecord || null;

export const selectHealthRecordsLoading = (
  state
) =>
  state.healthRecords?.loading ||
  false;

export const selectHealthRecordsError = (
  state
) =>
  state.healthRecords?.error || null;

export const selectHealthRecordActionLoading = (
  state
) =>
  state.healthRecords
    ?.actionLoading || false;

export const selectHealthRecordActionError = (
  state
) =>
  state.healthRecords
    ?.actionError || null;

/* =========================================================
   EXPORT
========================================================= */

export default healthRecordSlice.reducer;