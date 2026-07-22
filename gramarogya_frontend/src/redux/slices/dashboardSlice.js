import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dashboardService from "../../services/dashboardService";

// ==========================
// Dashboard
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

const initialState = {
  stats: {
    userName: "",

    totalBeneficiaries: 0,
    totalVisits: 0,
    todayVisits: 0,
    upcomingVisits: 0,

    pregnantWomen: 0,
    children: 0,
    tbPatients: 0,
    elderly: 0,

    totalUsers: 0,
    totalAnms: 0,
    totalAshas: 0,
    pendingVerifications: 0,
    assignedAshas: 0,
  },

  recentActivities: [],
  alerts: [],
  upcomingVisits: [],
  lowStockMedicines: [],
  pendingVerifications: [],

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

        state.stats = action.payload.stats;
        state.recentActivities = action.payload.recentActivities;
        state.alerts = action.payload.alerts;
        state.upcomingVisits = action.payload.upcomingVisits;
        state.lowStockMedicines = action.payload.lowStockMedicines;
        state.pendingVerifications =
          action.payload.pendingVerifications;
      })

      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default dashboardSlice.reducer;