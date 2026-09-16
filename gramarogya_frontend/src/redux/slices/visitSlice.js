import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

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
      // Get logged-in user
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user?.id) {
        throw new Error("Logged-in user not found.");
      }

      // =========================
      // ONLINE
      // =========================

      if (isOnline()) {
        const visits = await visitService.getAllVisits();

        // Save latest complete visit list locally
        await saveVisitsOffline(visits);

        return visits;
      }

      // =========================
      // OFFLINE
      // =========================

      const offlineVisits = await getOfflineVisits();

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
      // =========================
      // ONLINE
      // =========================

      if (isOnline()) {
        const visit = await visitService.getVisitById(id);

        // Save/update this visit locally
        if (visit) {
          await saveVisitOffline(visit);
        }

        return visit;
      }

      // =========================
      // OFFLINE
      // =========================

      const offlineVisits = await getOfflineVisits();

      const visit = offlineVisits.find(
        (item) => item.id === id
      );

      if (!visit) {
        throw new Error(
          "This visit is not available offline."
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

export const fetchVisitsByBeneficiary = createAsyncThunk(
  "visits/fetchByBeneficiary",
  async (beneficiaryId, thunkAPI) => {
    try {
      if (!beneficiaryId) {
        throw new Error("Beneficiary ID is required.");
      }

      let visits;

      // =========================
      // ONLINE
      // =========================

      if (isOnline()) {
        visits = await visitService.getAllVisits();

        // Save latest visits locally
        await saveVisitsOffline(visits);
      }

      // =========================
      // OFFLINE
      // =========================

      else {
        visits = await getOfflineVisits();
      }

      // Get only this beneficiary's visits
      const beneficiaryVisits = visits.filter(
        (visit) =>
          visit.beneficiaryId === beneficiaryId
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
      // =========================
      // ONLINE
      // =========================

      if (isOnline()) {
        return await visitService.createVisit(visitData);
      }

      // =========================
      // OFFLINE
      // =========================

      const localVisitId =
        `LOCAL_VISIT_${crypto.randomUUID()}`;

      const operationId =
        crypto.randomUUID();

      const offlineVisit = {
        ...visitData,
        id: localVisitId,
        syncStatus: "PENDING",
        isOffline: true,
      };

      // Save visit in IndexedDB
      await createOfflineVisit(offlineVisit);

      // Add operation to sync queue
      await addToSyncQueue({
        operationId,
        entityType: "VISIT",
        operation: "CREATE",
        localId: localVisitId,
        payload: offlineVisit,
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

      const updatedVisit = await updateOfflineVisit(
        id,
        visitData
      );

      const operationId =
        crypto.randomUUID();

      await addToSyncQueue({
        operationId,
        entityType: "VISIT",
        operation: "UPDATE",
        localId: id,
        payload: updatedVisit,
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

const deletedVisit =
  await deleteOfflineVisit(id);

const operationId =
  crypto.randomUUID();

await addToSyncQueue({
  operationId,
  entityType: "VISIT",
  operation: "DELETE",
  localId: deletedVisit.id,
  payload: deletedVisit,
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

   Online:
   - Get today's visits from backend
   - Add/update them in IndexedDB
   - DO NOT clear existing visits

   Offline:
   - Read today's visits from IndexedDB
========================================================= */

export const fetchTodayVisits = createAsyncThunk(
  "visits/fetchToday",
  async (_, thunkAPI) => {
    try {
      // =========================
      // ONLINE
      // =========================

      if (isOnline()) {
        const visits =
          await visitService.getTodayVisits();

        /*
         * IMPORTANT:
         *
         * Do NOT use saveVisitsOffline() here.
         *
         * saveVisitsOffline() clears the entire
         * visits table first.
         *
         * We only want to add/update today's visits.
         */

        await upsertVisitsOffline(visits);

        return visits;
      }

      // =========================
      // OFFLINE
      // =========================

      const today = new Date()
        .toISOString()
        .split("T")[0];

      const offlineTodayVisits =
        await getOfflineTodayVisits(today);

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

    /* =========================
       CLEAR ERROR
    ========================= */

    clearVisitError: (state) => {
      state.error = null;
    },


    /* =========================
       CLEAR SELECTED VISIT
    ========================= */

    clearSelectedVisit: (state) => {
      state.selectedVisit = null;
    },


    /* =========================
   CLEAR BENEFICIARY VISITS
========================= */

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

      .addCase(fetchVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchVisits.fulfilled, (state, action) => {
        state.loading = false;

        state.visits = Array.isArray(action.payload)
          ? action.payload
          : [];
      })

      .addCase(fetchVisits.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          normalizeApiError(
            null,
            "Failed to fetch visits."
          );
      });


    /* =====================================================
       FETCH VISIT BY ID
    ===================================================== */

    builder

      .addCase(fetchVisitById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchVisitById.fulfilled, (state, action) => {
        state.loading = false;

        state.selectedVisit = action.payload;
      })

      .addCase(fetchVisitById.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          normalizeApiError(
            null,
            "Failed to fetch visit."
          );
      });

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
        Array.isArray(action.payload)
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

      .addCase(createVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createVisit.fulfilled, (state, action) => {
        state.loading = false;

        const newVisit = action.payload;

        /*
         * Add new visit to main list
         */

        state.visits.push(newVisit);


        /*
         * If the visit is scheduled for today,
         * also add it to today's visits.
         */

        const today = new Date()
          .toISOString()
          .split("T")[0];

        if (
          newVisit?.scheduledDate &&
          newVisit.scheduledDate === today
        ) {
          state.todayVisits.push(newVisit);
        }
      })

      .addCase(createVisit.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          normalizeApiError(
            null,
            "Failed to create visit."
          );
      });


    /* =====================================================
       UPDATE VISIT
    ===================================================== */

    builder

      .addCase(updateVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateVisit.fulfilled, (state, action) => {
        state.loading = false;

        const updatedVisit = action.payload;

        /*
         * =========================
         * UPDATE MAIN VISITS LIST
         * =========================
         */

        const index = state.visits.findIndex(
          (visit) =>
            visit.id === updatedVisit.id
        );

        if (index !== -1) {
          state.visits[index] = updatedVisit;
        }


        /*
         * =========================
         * UPDATE SELECTED VISIT
         * =========================
         */

        if (
          state.selectedVisit &&
          state.selectedVisit.id ===
            updatedVisit.id
        ) {
          state.selectedVisit = updatedVisit;
        }


        /*
         * =========================
         * UPDATE TODAY'S VISITS
         * =========================
         */

        const today = new Date()
          .toISOString()
          .split("T")[0];

        const todayIndex =
          state.todayVisits.findIndex(
            (visit) =>
              visit.id === updatedVisit.id
          );


        /*
         * Visit is scheduled today
         */

        if (
          updatedVisit.scheduledDate === today
        ) {

          if (todayIndex !== -1) {

            state.todayVisits[todayIndex] =
              updatedVisit;

          } else {

            state.todayVisits.push(
              updatedVisit
            );
          }

        }


        /*
         * Visit is NOT scheduled today
         */

        else {

          if (todayIndex !== -1) {

            state.todayVisits.splice(
              todayIndex,
              1
            );
          }
        }
      })

      .addCase(updateVisit.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          normalizeApiError(
            null,
            "Failed to update visit."
          );
      });


    /* =====================================================
       DELETE VISIT
    ===================================================== */

    builder

      .addCase(deleteVisit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteVisit.fulfilled, (state, action) => {
        state.loading = false;

        const deletedId = action.payload;


        /*
         * =========================
         * REMOVE FROM ALL VISITS
         * =========================
         */

        state.visits =
          state.visits.filter(
            (visit) =>
              visit.id !== deletedId
          );


        /*
         * =========================
         * REMOVE FROM TODAY'S VISITS
         * =========================
         */

        state.todayVisits =
          state.todayVisits.filter(
            (visit) =>
              visit.id !== deletedId
          );


        /*
         * =========================
         * CLEAR SELECTED VISIT
         * =========================
         */

        if (
          state.selectedVisit?.id ===
          deletedId
        ) {
          state.selectedVisit = null;
        }
      })

      .addCase(deleteVisit.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          normalizeApiError(
            null,
            "Failed to delete visit."
          );
      });


    /* =====================================================
       FETCH TODAY'S VISITS
    ===================================================== */

    builder

      .addCase(fetchTodayVisits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchTodayVisits.fulfilled, (state, action) => {
        state.loading = false;

        state.todayVisits =
          Array.isArray(action.payload)
            ? action.payload
            : [];
      })

      .addCase(fetchTodayVisits.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload ||
          normalizeApiError(
            null,
            "Failed to fetch today's visits."
          );
      });
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