import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "../../services/reportService";

// =======================
// FETCH REPORT SUMMARY
// =======================
export const fetchSummary = createAsyncThunk(
  "reports/fetchSummary",
  async (_, thunkAPI) => {
    try {
      return await reportService.fetchSummary();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// =======================
// FETCH BENEFICIARY REPORT
// =======================
export const fetchBeneficiaryReport = createAsyncThunk(
  "reports/fetchBeneficiaryReport",
  async (_, thunkAPI) => {
    try {
      return await reportService.fetchBeneficiaryReport();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const initialState = {
  summary: {
    totalBeneficiaries: 0,
    totalVisits: 0,
    totalHealthRecords: 0,
    totalMedicines: 0,
    lowStockMedicines: 0,
    outOfStockMedicines: 0,
  },

  beneficiaryReport: [],

  loading: false,
  success: false,
  error: null,
};

const reportSlice = createSlice({
  name: "reports",
  initialState,

  reducers: {
    resetReportState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= SUMMARY =================
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.summary = action.payload;
      })
      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= BENEFICIARY REPORT =================
      .addCase(fetchBeneficiaryReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBeneficiaryReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.beneficiaryReport = action.payload;
      })
      .addCase(fetchBeneficiaryReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetReportState } = reportSlice.actions;

export default reportSlice.reducer;