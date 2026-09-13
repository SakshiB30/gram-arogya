import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import anmService from "../../services/anmService";

// ================================
// FETCH PENDING ASHAS
// ================================

export const fetchPendingAshas = createAsyncThunk(
  "anm/fetchPendingAshas",
  async (_, thunkAPI) => {
    try {
      return await anmService.getPendingAshas();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to load pending ASHAs"
      );
    }
  }
);

// ================================
// APPROVE ASHA
// ================================

export const approveAsha = createAsyncThunk(
  "anm/approveAsha",
  async (ashaId, thunkAPI) => {
    try {
      return await anmService.approveAsha(ashaId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to approve ASHA"
      );
    }
  }
);

// ================================
// REJECT ASHA
// ================================

export const rejectAsha = createAsyncThunk(
  "anm/rejectAsha",
  async (ashaId, thunkAPI) => {
    try {
      return await anmService.rejectAsha(ashaId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to reject ASHA"
      );
    }
  }
);

// ================================
// INITIAL STATE
// ================================

const initialState = {
  pendingAshas: [],
  loading: false,
  actionLoading: false,
  error: null,
};

// ================================
// SLICE
// ================================

const anmSlice = createSlice({
  name: "anm",

  initialState,

  reducers: {
    clearAnmError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {

    // ================================
    // FETCH PENDING ASHAS
    // ================================

    builder
      .addCase(fetchPendingAshas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPendingAshas.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingAshas = action.payload;
      })

      .addCase(fetchPendingAshas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    // ================================
    // APPROVE ASHA
    // ================================

    builder
      .addCase(approveAsha.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(approveAsha.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.pendingAshas = state.pendingAshas.filter(
          (asha) => asha.id !== action.payload.id
        );
      })

      .addCase(approveAsha.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });


    // ================================
    // REJECT ASHA
    // ================================

    builder
      .addCase(rejectAsha.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })

      .addCase(rejectAsha.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.pendingAshas = state.pendingAshas.filter(
          (asha) => asha.id !== action.payload.id
        );
      })

      .addCase(rejectAsha.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });

  },
});

export const {
  clearAnmError,
} = anmSlice.actions;

export default anmSlice.reducer;