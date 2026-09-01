import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import dashboardService from "../../services/dashboardService";

// =====================================================
// FETCH DASHBOARD
// =====================================================

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",

  async (_, thunkAPI) => {

    try {

      const data =
        await dashboardService.getDashboard();

      return data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to load dashboard"
      );
    }
  }
);


// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {

  // ===================================================
  // DASHBOARD STATS
  // ===================================================

  stats: {

    userName: "",

    // Common
    totalBeneficiaries: 0,
    totalVisits: 0,
    todayVisits: 0,
    upcomingVisits: 0,
    pendingVisits: 0,

    // Health Programs
    pregnantWomen: 0,
    children: 0,
    tbPatients: 0,
    elderly: 0,

    // Admin
    totalUsers: 0,
    totalAnms: 0,
    totalAshas: 0,
    pendingVerifications: 0,

    // ANM
    assignedAshas: 0,

    // Alerts
    criticalAlerts: 0,
  },


  // ===================================================
  // DASHBOARD DATA
  // ===================================================

  recentActivities: [],

  alerts: [],

  upcomingVisits: [],

  lowStockMedicines: [],

  pendingVerifications: [],

  // IMPORTANT:
  // Health program progress data
  healthPrograms: [],


  // ===================================================
  // REQUEST STATE
  // ===================================================

  loading: false,

  error: null,
};


// =====================================================
// SLICE
// =====================================================

const dashboardSlice = createSlice({

  name: "dashboard",

  initialState,

  reducers: {},


  // ===================================================
  // ASYNC THUNK
  // ===================================================

  extraReducers: (builder) => {

    builder

      // =================================================
      // LOADING
      // =================================================

      .addCase(
        fetchDashboard.pending,
        (state) => {

          state.loading = true;
          state.error = null;
        }
      )


      // =================================================
      // SUCCESS
      // =================================================

      .addCase(
        fetchDashboard.fulfilled,
        (state, action) => {

          state.loading = false;
          state.error = null;

          const data = action.payload;


          // =============================================
          // STATS
          // =============================================

          state.stats =
            data?.stats || initialState.stats;


          // =============================================
          // RECENT ACTIVITIES
          // =============================================

          state.recentActivities =
            data?.recentActivities || [];


          // =============================================
          // ALERTS
          // =============================================

          state.alerts =
            data?.alerts || [];


          // =============================================
          // UPCOMING VISITS
          // =============================================

          state.upcomingVisits =
            data?.upcomingVisits || [];


          // =============================================
          // LOW STOCK MEDICINES
          // =============================================

          state.lowStockMedicines =
            data?.lowStockMedicines || [];


          // =============================================
          // PENDING VERIFICATIONS
          // =============================================

          state.pendingVerifications =
            data?.pendingVerifications || [];


          // =============================================
          // HEALTH PROGRAMS
          // =============================================

          state.healthPrograms =
            data?.healthPrograms || [];
        }
      )


      // =================================================
      // ERROR
      // =================================================

      .addCase(
        fetchDashboard.rejected,
        (state, action) => {

          state.loading = false;

          state.error =
            action.payload ||
            "Failed to load dashboard";
        }
      );
  },
});


// =====================================================
// EXPORT
// =====================================================

export default dashboardSlice.reducer;
