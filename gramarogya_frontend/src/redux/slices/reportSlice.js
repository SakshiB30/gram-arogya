import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reportService from "../../services/reportService";

// =====================================================
// HELPER
// =====================================================

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data ||
    error.message ||
    "Something went wrong"
  );
};


// =====================================================
// FETCH REPORT SUMMARY
// =====================================================

export const fetchSummary = createAsyncThunk(
  "reports/fetchSummary",
  async (_, thunkAPI) => {
    try {
      return await reportService.fetchSummary();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);


// =====================================================
// FETCH BENEFICIARY REPORT
// =====================================================

export const fetchBeneficiaryReport = createAsyncThunk(
  "reports/fetchBeneficiaryReport",
  async (_, thunkAPI) => {
    try {
      return await reportService.fetchBeneficiaryReport();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);


// =====================================================
// FETCH VISIT REPORT
// =====================================================

export const fetchVisitReport = createAsyncThunk(
  "reports/fetchVisitReport",
  async (_, thunkAPI) => {
    try {
      return await reportService.fetchVisitReport();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);


// =====================================================
// FETCH INVENTORY REPORT
// =====================================================

export const fetchInventoryReport = createAsyncThunk(
  "reports/fetchInventoryReport",
  async (_, thunkAPI) => {
    try {
      return await reportService.fetchInventoryReport();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);


// =====================================================
// FETCH HEALTH RECORD REPORT
// =====================================================

export const fetchHealthRecordReport = createAsyncThunk(
  "reports/fetchHealthRecordReport",
  async (_, thunkAPI) => {
    try {
      return await reportService.fetchHealthRecordReport();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);


// =====================================================
// FETCH LOW STOCK REPORT
// =====================================================

export const fetchLowStockReport = createAsyncThunk(
  "reports/fetchLowStockReport",
  async (_, thunkAPI) => {
    try {
      return await reportService.fetchLowStockReport();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);


// =====================================================
// FETCH OUT OF STOCK REPORT
// =====================================================

export const fetchOutOfStockReport = createAsyncThunk(
  "reports/fetchOutOfStockReport",
  async (_, thunkAPI) => {
    try {
      return await reportService.fetchOutOfStockReport();
    } catch (error) {
      return thunkAPI.rejectWithValue(getErrorMessage(error));
    }
  }
);


// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  // Summary
  summary: {
    totalBeneficiaries: 0,
    totalVisits: 0,
    totalHealthRecords: 0,
    totalMedicines: 0,
    lowStockMedicines: 0,
    outOfStockMedicines: 0,
  },

  // Reports
  beneficiaryReport: [],
  visitReport: [],
  inventoryReport: [],
  healthRecordReport: [],
  lowStockReport: [],
  outOfStockReport: [],

  // UI state
  loading: false,
  success: false,
  error: null,
};


// =====================================================
// SLICE
// =====================================================

const reportSlice = createSlice({
  name: "reports",

  initialState,

  reducers: {

    resetReportState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },

    clearReportError: (state) => {
      state.error = null;
    },

  },

  extraReducers: (builder) => {

    // =================================================
    // SUMMARY
    // =================================================

    builder
      .addCase(fetchSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.summary = {
          ...state.summary,
          ...action.payload,
        };
      })

      .addCase(fetchSummary.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });


    // =================================================
    // BENEFICIARY REPORT
    // =================================================

    builder
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
        state.success = false;
        state.error = action.payload;
      });


    // =================================================
    // VISIT REPORT
    // =================================================

    builder
      .addCase(fetchVisitReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchVisitReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.visitReport = action.payload;
      })

      .addCase(fetchVisitReport.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });


    // =================================================
    // INVENTORY REPORT
    // =================================================

    builder
      .addCase(fetchInventoryReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchInventoryReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.inventoryReport = action.payload;
      })

      .addCase(fetchInventoryReport.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });


    // =================================================
    // HEALTH RECORD REPORT
    // =================================================

    builder
      .addCase(fetchHealthRecordReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHealthRecordReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.healthRecordReport = action.payload;
      })

      .addCase(fetchHealthRecordReport.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });


    // =================================================
    // LOW STOCK
    // =================================================

    builder
      .addCase(fetchLowStockReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchLowStockReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.lowStockReport = action.payload;
      })

      .addCase(fetchLowStockReport.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });


    // =================================================
    // OUT OF STOCK
    // =================================================

    builder
      .addCase(fetchOutOfStockReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchOutOfStockReport.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.outOfStockReport = action.payload;
      })

      .addCase(fetchOutOfStockReport.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload;
      });

  },
});


// =====================================================
// EXPORT ACTIONS
// =====================================================

export const {
  resetReportState,
  clearReportError,
} = reportSlice.actions;


// =====================================================
// EXPORT REDUCER
// =====================================================

export default reportSlice.reducer;