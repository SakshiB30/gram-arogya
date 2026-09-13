import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import medicineFollowUpService from "../../services/medicineFollowUpService";
import { normalizeApiError } from "../../utils/apiError";

// ==================================================
// CREATE MEDICINE FOLLOW-UP
// ==================================================
export const createMedicineFollowUp = createAsyncThunk(
  "medicineFollowUp/createMedicineFollowUp",
  async (followUpData, thunkAPI) => {
    try {
      return await medicineFollowUpService.createFollowUp(
        followUpData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(error, "Failed to create medicine follow-up.")
      );
    }
  }
);

// ==================================================
// GET FOLLOW-UPS BY BENEFICIARY
// ==================================================
export const getFollowUpsByBeneficiary = createAsyncThunk(
  "medicineFollowUp/getFollowUpsByBeneficiary",
  async (beneficiaryId, thunkAPI) => {
    try {
      return await medicineFollowUpService.getFollowUpsByBeneficiary(
        beneficiaryId
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(error, "Failed to fetch medicine follow-ups.")
      );
    }
  }
);

// ==================================================
// GET FOLLOW-UPS BY VISIT
// ==================================================
export const getFollowUpsByVisit = createAsyncThunk(
  "medicineFollowUp/getFollowUpsByVisit",
  async (visitId, thunkAPI) => {
    try {
      return await medicineFollowUpService.getFollowUpsByVisit(
        visitId
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(error, "Failed to fetch visit follow-ups.")
      );
    }
  }
);

// ==================================================
// GET FOLLOW-UP BY ID
// ==================================================
export const getFollowUpById = createAsyncThunk(
  "medicineFollowUp/getFollowUpById",
  async (id, thunkAPI) => {
    try {
      return await medicineFollowUpService.getFollowUpById(
        id
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(error, "Failed to fetch medicine follow-up.")
      );
    }
  }
);

// ==================================================
// INITIAL STATE
// ==================================================
const initialState = {
  followUps: [],
  followUp: null,

  loading: false,
  success: false,
  error: null,
};

// ==================================================
// SLICE
// ==================================================
const medicineFollowUpSlice = createSlice({
  name: "medicineFollowUp",
  initialState,

  reducers: {

    // ==================================================
    // CLEAR ERROR
    // ==================================================
    clearMedicineFollowUpError: (state) => {
      state.error = null;
    },

    // ==================================================
    // CLEAR SUCCESS
    // ==================================================
    clearMedicineFollowUpSuccess: (state) => {
      state.success = false;
    },

    // ==================================================
    // CLEAR SELECTED FOLLOW-UP
    // ==================================================
    clearSelectedFollowUp: (state) => {
      state.followUp = null;
    },

    // ==================================================
    // RESET FOLLOW-UP STATE
    // ==================================================
    resetMedicineFollowUpState: (state) => {
      state.followUps = [];
      state.followUp = null;
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==================================================
      // CREATE FOLLOW-UP
      // ==================================================
      .addCase(
        createMedicineFollowUp.pending,
        (state) => {
          state.loading = true;
          state.error = null;
          state.success = false;
        }
      )

      .addCase(
        createMedicineFollowUp.fulfilled,
        (state, action) => {
          state.loading = false;
          state.success = true;

          // Add newest follow-up at the beginning
          state.followUps.unshift(action.payload);

          // Store newly created follow-up
          state.followUp = action.payload;
        }
      )

      .addCase(
        createMedicineFollowUp.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ==================================================
      // GET FOLLOW-UPS BY BENEFICIARY
      // ==================================================
      .addCase(
        getFollowUpsByBeneficiary.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getFollowUpsByBeneficiary.fulfilled,
        (state, action) => {
          state.loading = false;
          state.followUps = action.payload;
        }
      )

      .addCase(
        getFollowUpsByBeneficiary.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ==================================================
      // GET FOLLOW-UPS BY VISIT
      // ==================================================
      .addCase(
        getFollowUpsByVisit.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getFollowUpsByVisit.fulfilled,
        (state, action) => {
          state.loading = false;
          state.followUps = action.payload;
        }
      )

      .addCase(
        getFollowUpsByVisit.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // ==================================================
      // GET FOLLOW-UP BY ID
      // ==================================================
      .addCase(
        getFollowUpById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getFollowUpById.fulfilled,
        (state, action) => {
          state.loading = false;
          state.followUp = action.payload;
        }
      )

      .addCase(
        getFollowUpById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

// ==================================================
// EXPORT ACTIONS
// ==================================================
export const {
  clearMedicineFollowUpError,
  clearMedicineFollowUpSuccess,
  clearSelectedFollowUp,
  resetMedicineFollowUpState,
} = medicineFollowUpSlice.actions;

// ==================================================
// EXPORT REDUCER
// ==================================================
export default medicineFollowUpSlice.reducer;
