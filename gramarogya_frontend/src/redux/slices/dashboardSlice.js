import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dashboardService from "../../services/dashboardService";

// ==========================
// Dashboard Stats
// ==========================
export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async (_, thunkAPI) => {
    try {
      return await dashboardService.getDashboard();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load dashboard"
      );
    }
  }
);


// ==========================
// Recent Activities
// ==========================
export const fetchRecentActivities = createAsyncThunk(
  "dashboard/fetchRecentActivities",
  async (_, thunkAPI) => {
    try {
      return await dashboardService.getRecentActivities();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load activities"
      );
    }
  }
);

// ==========================
// Dashboard Alerts
// ==========================
export const fetchAlerts = createAsyncThunk(
  "dashboard/fetchAlerts",
  async (_, thunkAPI) => {
    try {
      return await dashboardService.getAlerts();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load alerts"
      );
    }
  }
);

const initialState = {
  stats: {
    totalBeneficiaries: 0,
    totalVisits: 0,
    todayVisits: 0,
    upcomingVisits: 0,
    pregnantWomen: 0,
    children: 0,
    tbPatients: 0,
    elderly: 0,
  },

  recentActivities: [],

  alerts: [],

  loading: false,

  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      // ================= Dashboard =================
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload;
      })

      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Activities =================
      .addCase(fetchRecentActivities.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchRecentActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.recentActivities = action.payload;
      })

      .addCase(fetchRecentActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= Alerts =================
      .addCase(fetchAlerts.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload;
      })

      .addCase(fetchAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;