import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import visitService from "../../services/visitService";

/* =========================================================
   GET ALL VISITS
========================================================= */

export const fetchVisits = createAsyncThunk(
  "visits/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await visitService.getAllVisits();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch visits"
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
      return await visitService.getVisitById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch visit"
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
      return await visitService.createVisit(visitData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to create visit"
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
      return await visitService.updateVisit(
        id,
        visitData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to update visit"
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
      await visitService.deleteVisit(id);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to delete visit"
      );
    }
  }
);


/* =========================================================
   GET TODAY'S VISITS
   Based only on scheduledDate
========================================================= */

export const fetchTodayVisits = createAsyncThunk(
  "visits/fetchToday",
  async (_, thunkAPI) => {
    try {
      return await visitService.getTodayVisits();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch today's visits"
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

  },

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
          action.payload || "Failed to fetch visits";
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
          action.payload || "Failed to fetch visit";
      });


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

        state.visits.push(action.payload);

        /*
         * If the newly created visit is scheduled for today,
         * also add it to today's schedule.
         */
        if (
          action.payload?.scheduledDate &&
          action.payload.scheduledDate ===
            new Date().toISOString().split("T")[0]
        ) {
          state.todayVisits.push(action.payload);
        }
      })

      .addCase(createVisit.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed to create visit";
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

        /* Update main visits list */

        const index = state.visits.findIndex(
          (visit) => visit.id === updatedVisit.id
        );

        if (index !== -1) {
          state.visits[index] = updatedVisit;
        }


        /* Update selected visit */

        if (
          state.selectedVisit &&
          state.selectedVisit.id === updatedVisit.id
        ) {
          state.selectedVisit = updatedVisit;
        }


        /* =================================================
           Update today's visits
        ================================================= */

        const today =
          new Date().toISOString().split("T")[0];

        const todayIndex =
          state.todayVisits.findIndex(
            (visit) => visit.id === updatedVisit.id
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
         * Visit is no longer scheduled today
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
          action.payload || "Failed to update visit";
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

        /* Remove from all visits */

        state.visits =
          state.visits.filter(
            (visit) => visit.id !== deletedId
          );


        /* Remove from today's visits */

        state.todayVisits =
          state.todayVisits.filter(
            (visit) => visit.id !== deletedId
          );


        /* Clear selected visit */

        if (
          state.selectedVisit?.id === deletedId
        ) {
          state.selectedVisit = null;
        }

      })

      .addCase(deleteVisit.rejected, (state, action) => {
        state.loading = false;

        state.error =
          action.payload || "Failed to delete visit";
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
          "Failed to fetch today's visits";
      });

  },
});


/* =========================================================
   ACTIONS
========================================================= */

export const {
  clearVisitError,
  clearSelectedVisit,
} = visitSlice.actions;


/* =========================================================
   REDUCER
========================================================= */

export default visitSlice.reducer;