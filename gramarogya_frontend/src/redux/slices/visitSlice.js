import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import visitService from "../../services/visitService";
import { normalizeApiError } from "../../utils/apiError";

import {
  saveVisitsOffline,
  saveVisitOffline,
  createOfflineVisit,
  updateOfflineVisit,
  deleteOfflineVisit,
  getOfflineVisits,
  getOfflineTodayVisits,
  upsertVisitsOffline,
} from "../../offline/visitOfflineService";

import { addToSyncQueue } from "../../offline/syncQueueService";
import { isOnline } from "../../offline/network";


/* =========================================================
   GET ALL VISITS
========================================================= */

export const fetchVisits = createAsyncThunk(
  "visits/fetchAll",
  async (_, thunkAPI) => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user?.id) {
        throw new Error(
          "Logged-in user not found."
        );
      }

      // =========================
      // ONLINE
      // =========================

      if (isOnline()) {
        const visits =
          await visitService.getAllVisits();

        const visitsForOffline =
          Array.isArray(visits)
            ? visits.map((visit) => ({
                ...visit,

                ashaId:
                  visit.ashaId ||
                  visit.userId,
              }))
            : [];

        await saveVisitsOffline(
          visitsForOffline
        );

        return visits;
      }

      // =========================
      // OFFLINE
      // =========================

      const offlineVisits =
        await getOfflineVisits(user.id);

      return offlineVisits;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(
          error,
          "Failed to fetch visits."
        )
      );
    }
  }
);


/* =========================================================
   GET VISIT BY ID
========================================================= */

export const fetchVisitById = createAsyncThunk(
  "visits/fetchById",
  async (id, thunkAPI) => {
    try {
      if (!id) {
        throw new Error(
          "Visit ID is required."
        );
      }

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user?.id) {
        throw new Error(
          "Logged-in user not found."
        );
      }

      // =========================
      // ONLINE
      // =========================

      if (isOnline()) {
        const visit =
          await visitService.getVisitById(id);

        if (visit) {
          /*
           * Normalize ownership before
           * saving to IndexedDB.
           */
          const visitForOffline = {
            ...visit,

            ashaId:
              visit.ashaId ||
              visit.userId,
          };

          await saveVisitOffline(
            visitForOffline
          );

          return visitForOffline;
        }

        return visit;
      }

      // =========================
      // OFFLINE
      // =========================

      /*
       * Only retrieve visits belonging
       * to the logged-in ASHA.
       */
      const offlineVisits =
        await getOfflineVisits(
          user.id
        );

      const visit =
        offlineVisits.find(
          (item) => item.id === id
        );

      if (!visit) {
        throw new Error(
          "This visit is not available offline or you are not authorized to access it."
        );
      }

      return visit;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(
          error,
          "Failed to fetch visit."
        )
      );
    }
  }
);


/* =========================================================
   GET VISITS BY BENEFICIARY
========================================================= */

export const fetchVisitsByBeneficiary =
  createAsyncThunk(
    "visits/fetchByBeneficiary",
    async (beneficiaryId, thunkAPI) => {
      try {
        if (!beneficiaryId) {
          throw new Error(
            "Beneficiary ID is required."
          );
        }

        const user = JSON.parse(
          localStorage.getItem("user")
        );

        if (!user?.id) {
          throw new Error(
            "Logged-in user not found."
          );
        }

        let visits;

        // =========================
        // ONLINE
        // =========================

        if (isOnline()) {
          visits =
            await visitService.getAllVisits();

          const visitsForOffline =
            Array.isArray(visits)
              ? visits.map((visit) => ({
                  ...visit,

                  ashaId:
                    visit.ashaId ||
                    visit.userId,
                }))
              : [];

          await saveVisitsOffline(
            visitsForOffline
          );

          visits = visitsForOffline;
        }

        // =========================
        // OFFLINE
        // =========================

        else {
          visits =
            await getOfflineVisits(
              user.id
            );
        }

        // =========================
        // FILTER BENEFICIARY
        // =========================

        const beneficiaryVisits =
          visits.filter(
            (visit) =>
              visit.beneficiaryId ===
              beneficiaryId
          );

        return beneficiaryVisits;

      } catch (error) {
        return thunkAPI.rejectWithValue(
          normalizeApiError(
            error,
            "Failed to fetch beneficiary visits."
          )
        );
      }
    }
  );


/* =========================================================
   CREATE VISIT
========================================================= */

export const createVisit = createAsyncThunk(
  "visits/create",
  async (visitData, thunkAPI) => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user?.id) {
        throw new Error(
          "Logged-in user not found."
        );
      }

      // =========================
      // ONLINE
      // =========================

      if (isOnline()) {
        return await visitService.createVisit(
          visitData
        );
      }

      // =========================
      // OFFLINE
      // =========================

      const localVisitId =
        `LOCAL_VISIT_${crypto.randomUUID()}`;

      const operationId =
        crypto.randomUUID();

      const now =
        new Date().toISOString();

      const offlineVisit = {
        ...visitData,

        id: localVisitId,

        ashaId: user.id,

        syncStatus: "PENDING",

        isOffline: true,

        createdAt: now,

        updatedAt: now,
      };

      await createOfflineVisit(
        offlineVisit
      );

      await addToSyncQueue({
        operationId,

        entityType: "VISIT",

        operation: "CREATE",

        localId: localVisitId,

        payload: offlineVisit,

        ashaId: user.id,
      });

      return offlineVisit;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(
          error,
          "Failed to create visit."
        )
      );
    }
  }
);


/* =========================================================
   UPDATE VISIT
========================================================= */

export const updateVisit = createAsyncThunk(
  "visits/update",
  async ({ id, visitData }, thunkAPI) => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user?.id) {
        throw new Error(
          "Logged-in user not found."
        );
      }

      // =========================
      // ONLINE
      // =========================

      if (isOnline()) {
        return await visitService.updateVisit(
          id,
          visitData
        );
      }

      // =========================
      // OFFLINE
      // =========================

      /*
       * The service verifies that
       * this visit belongs to the
       * logged-in ASHA.
       */
      const updatedVisit =
        await updateOfflineVisit(
          id,
          {
            ...visitData,

            ashaId: user.id,
          },
          user.id
        );

      const operationId =
        crypto.randomUUID();

      await addToSyncQueue({
        operationId,

        entityType: "VISIT",

        operation: "UPDATE",

        localId: id,

        payload: updatedVisit,

        ashaId: user.id,
      });

      return updatedVisit;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(
          error,
          "Failed to update visit."
        )
      );
    }
  }
);


/* =========================================================
   DELETE VISIT
========================================================= */

export const deleteVisit = createAsyncThunk(
  "visits/delete",
  async (id, thunkAPI) => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user?.id) {
        throw new Error(
          "Logged-in user not found."
        );
      }

      // =========================
      // ONLINE
      // =========================

      if (isOnline()) {
        await visitService.deleteVisit(id);

        return id;
      }

      // =========================
      // OFFLINE
      // =========================

      /*
       * The service verifies that
       * this visit belongs to the
       * logged-in ASHA.
       */
      const deletedVisit =
        await deleteOfflineVisit(
          id,
          user.id
        );

      const operationId =
        crypto.randomUUID();

      await addToSyncQueue({
        operationId,

        entityType: "VISIT",

        operation: "DELETE",

        localId: deletedVisit.id,

        payload: deletedVisit,

        ashaId: user.id,
      });

      return id;

    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(
          error,
          "Failed to delete visit."
        )
      );
    }
  }
);


/* =========================================================
   GET TODAY'S VISITS
========================================================= */

export const fetchTodayVisits =
  createAsyncThunk(
    "visits/fetchToday",
    async (_, thunkAPI) => {
      try {
        const user = JSON.parse(
          localStorage.getItem("user")
        );

        if (!user?.id) {
          throw new Error(
            "Logged-in user not found."
          );
        }

        // =========================
        // ONLINE
        // =========================

        if (isOnline()) {
          const visits =
            await visitService.getTodayVisits();

          const visitsForOffline =
            Array.isArray(visits)
              ? visits.map((visit) => ({
                  ...visit,

                  ashaId:
                    visit.ashaId ||
                    visit.userId,
                }))
              : [];

          await upsertVisitsOffline(
            visitsForOffline
          );

          return visits;
        }

        // =========================
        // OFFLINE
        // =========================

        const today =
          new Date()
            .toISOString()
            .split("T")[0];

        const offlineTodayVisits =
          await getOfflineTodayVisits(
            today,
            user.id
          );

        return offlineTodayVisits;

      } catch (error) {
        return thunkAPI.rejectWithValue(
          normalizeApiError(
            error,
            "Failed to fetch today's visits."
          )
        );
      }
    }
  );


/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  visits: [],

  todayVisits: [],

  selectedVisit: null,

  beneficiaryVisits: [],

  loading: false,

  error: null,
};


/* =========================================================
   SLICE
========================================================= */

const visitSlice = createSlice({
  name: "visit",

  initialState,

  reducers: {

    clearVisitError: (state) => {
      state.error = null;
    },

    clearSelectedVisit: (state) => {
      state.selectedVisit = null;
    },

    clearBeneficiaryVisits: (state) => {
      state.beneficiaryVisits = [];
    },

  },

  /* =======================================================
     ASYNC ACTIONS
  ======================================================= */

  extraReducers: (builder) => {

    /* =====================================================
       FETCH ALL VISITS
    ===================================================== */

    builder

      .addCase(
        fetchVisits.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchVisits.fulfilled,
        (state, action) => {
          state.loading = false;

          state.visits =
            Array.isArray(
              action.payload
            )
              ? action.payload
              : [];
        }
      )

      .addCase(
        fetchVisits.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            normalizeApiError(
              null,
              "Failed to fetch visits."
            );
        }
      );


    /* =====================================================
       FETCH VISIT BY ID
    ===================================================== */

    builder

      .addCase(
        fetchVisitById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchVisitById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.selectedVisit =
            action.payload;
        }
      )

      .addCase(
        fetchVisitById.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            normalizeApiError(
              null,
              "Failed to fetch visit."
            );
        }
      );


    /* =====================================================
       FETCH VISITS BY BENEFICIARY
    ===================================================== */

    builder

      .addCase(
        fetchVisitsByBeneficiary.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchVisitsByBeneficiary.fulfilled,
        (state, action) => {
          state.loading = false;

          state.beneficiaryVisits =
            Array.isArray(
              action.payload
            )
              ? action.payload
              : [];
        }
      )

      .addCase(
        fetchVisitsByBeneficiary.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            normalizeApiError(
              null,
              "Failed to fetch beneficiary visits."
            );
        }
      );


    /* =====================================================
       CREATE VISIT
    ===================================================== */

    builder

      .addCase(
        createVisit.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        createVisit.fulfilled,
        (state, action) => {
          state.loading = false;

          const newVisit =
            action.payload;

          state.visits.push(
            newVisit
          );

          const today =
            new Date()
              .toISOString()
              .split("T")[0];

          if (
            newVisit?.scheduledDate &&
            newVisit.scheduledDate ===
              today
          ) {
            state.todayVisits.push(
              newVisit
            );
          }
        }
      )

      .addCase(
        createVisit.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            normalizeApiError(
              null,
              "Failed to create visit."
            );
        }
      );


    /* =====================================================
       UPDATE VISIT
    ===================================================== */

    builder

      .addCase(
        updateVisit.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        updateVisit.fulfilled,
        (state, action) => {
          state.loading = false;

          const updatedVisit =
            action.payload;

          const index =
            state.visits.findIndex(
              (visit) =>
                visit.id ===
                updatedVisit.id
            );

          if (index !== -1) {
            state.visits[index] =
              updatedVisit;
          }

          if (
            state.selectedVisit &&
            state.selectedVisit.id ===
              updatedVisit.id
          ) {
            state.selectedVisit =
              updatedVisit;
          }

          const beneficiaryIndex =
            state.beneficiaryVisits.findIndex(
              (visit) =>
                visit.id ===
                updatedVisit.id
            );

          if (
            beneficiaryIndex !== -1
          ) {
            state.beneficiaryVisits[
              beneficiaryIndex
            ] = updatedVisit;
          }

          const today =
            new Date()
              .toISOString()
              .split("T")[0];

          const todayIndex =
            state.todayVisits.findIndex(
              (visit) =>
                visit.id ===
                updatedVisit.id
            );

          if (
            updatedVisit.scheduledDate ===
            today
          ) {
            if (
              todayIndex !== -1
            ) {
              state.todayVisits[
                todayIndex
              ] = updatedVisit;
            } else {
              state.todayVisits.push(
                updatedVisit
              );
            }
          } else {
            if (
              todayIndex !== -1
            ) {
              state.todayVisits.splice(
                todayIndex,
                1
              );
            }
          }
        }
      )

      .addCase(
        updateVisit.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            normalizeApiError(
              null,
              "Failed to update visit."
            );
        }
      );


    /* =====================================================
       DELETE VISIT
    ===================================================== */

    builder

      .addCase(
        deleteVisit.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        deleteVisit.fulfilled,
        (state, action) => {
          state.loading = false;

          const deletedId =
            action.payload;

          state.visits =
            state.visits.filter(
              (visit) =>
                visit.id !==
                deletedId
            );

          state.todayVisits =
            state.todayVisits.filter(
              (visit) =>
                visit.id !==
                deletedId
            );

          state.beneficiaryVisits =
            state.beneficiaryVisits.filter(
              (visit) =>
                visit.id !==
                deletedId
            );

          if (
            state.selectedVisit?.id ===
            deletedId
          ) {
            state.selectedVisit =
              null;
          }
        }
      )

      .addCase(
        deleteVisit.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            normalizeApiError(
              null,
              "Failed to delete visit."
            );
        }
      );


    /* =====================================================
       FETCH TODAY'S VISITS
    ===================================================== */

    builder

      .addCase(
        fetchTodayVisits.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchTodayVisits.fulfilled,
        (state, action) => {
          state.loading = false;

          state.todayVisits =
            Array.isArray(
              action.payload
            )
              ? action.payload
              : [];
        }
      )

      .addCase(
        fetchTodayVisits.rejected,
        (state, action) => {
          state.loading = false;

          state.error =
            action.payload ||
            normalizeApiError(
              null,
              "Failed to fetch today's visits."
            );
        }
      );
  },
});


/* =========================================================
   ACTIONS
========================================================= */

export const {
  clearVisitError,
  clearSelectedVisit,
  clearBeneficiaryVisits,
} = visitSlice.actions;


/* =========================================================
   REDUCER
========================================================= */

export default visitSlice.reducer;