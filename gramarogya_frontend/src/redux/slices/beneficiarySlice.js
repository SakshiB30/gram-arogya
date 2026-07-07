import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import beneficiaryService from "../../services/beneficiaryService";

/* ===========================
   GET ALL PATIENTS
=========================== */
export const fetchBeneficiaries = createAsyncThunk(
  "beneficiaries/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await beneficiaryService.getAllBeneficiaries();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch beneficiaries"
      );
    }
  }
);

/* ===========================
   GET BENEFICIARY  BY ID
=========================== */
export const fetchBeneficiaryById = createAsyncThunk(
  "beneficiaries/fetchById",
  async (id, thunkAPI) => {
    try {
      return await beneficiaryService.getBeneficiaryById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch beneficiary"
      );
    }
  }
);

/* ===========================
   CREATE BENEFICIARY
=========================== */
export const createBeneficiary = createAsyncThunk(
  "beneficiaries/createBeneficiary",
  async (beneficiaryData, thunkAPI) => {
    try {
      return await beneficiaryService.createBeneficiary(beneficiaryData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to create beneficiary"
      );
    }
  }
);

/* ===========================
   UPDATE BENEFICIARY
=========================== */

export const updateBeneficiary = createAsyncThunk(
  "beneficiaries/update",
  async ({ id, beneficiaryData }, thunkAPI) => {
    try {
      return await beneficiaryService.updateBeneficiary(
        id,
        beneficiaryData
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update beneficiary"
      );
    }
  }
);

/* ===========================
   DELETE BENEFICIARY
=========================== */

export const deleteBeneficiary = createAsyncThunk(
  "beneficiaries/delete",
  async (id, thunkAPI) => {
    try {
      await beneficiaryService.deleteBeneficiary(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete beneficiary"
      );
    }
  }
);

/* ===========================
   INITIAL STATE
=========================== */

const initialState = {
  beneficiaries: [],
  selectedBeneficiary: null,
  loading: false,
  error: null,
};

/* ===========================
   SLICE
=========================== */


const beneficiarySlice = createSlice({
  name: "beneficiaries",

  initialState,

  reducers: {
    clearBeneficiaryError: (state) => {
      state.error = null;
    },

    clearSelectedBeneficiary: (state) => {
      state.selectedBeneficiary = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===========================
         FETCH ALL
      =========================== */

      .addCase(fetchBeneficiaries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBeneficiaries.fulfilled, (state, action) => {
        state.loading = false;
        state.beneficiaries = action.payload;
      })

      .addCase(fetchBeneficiaries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===========================
         FETCH BY ID
      =========================== */

      .addCase(fetchBeneficiaryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchBeneficiaryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBeneficiary = action.payload;
      })

      .addCase(fetchBeneficiaryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===========================
         CREATE
      =========================== */

      .addCase(createBeneficiary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(createBeneficiary.fulfilled, (state, action) => {
        state.loading = false;
        state.beneficiaries.push(action.payload);
      })

      .addCase(createBeneficiary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===========================
         UPDATE
      =========================== */

      .addCase(updateBeneficiary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateBeneficiary.fulfilled, (state, action) => {
        state.loading = false;

        const index = state.beneficiaries.findIndex(
          (beneficiary) => beneficiary.id === action.payload.id
        );

        if (index !== -1) {
          state.beneficiaries[index] = action.payload;
        }

        if (
          state.selectedBeneficiary &&
          state.selectedBeneficiary.id === action.payload.id
        ) {
          state.selectedBeneficiary = action.payload;
        }
      })

      .addCase(updateBeneficiary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===========================
         DELETE
      =========================== */

      .addCase(deleteBeneficiary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(deleteBeneficiary.fulfilled, (state, action) => {
        state.loading = false;

        state.beneficiaries = state.beneficiaries.filter(
          (beneficiary) => beneficiary.id !== action.payload
        );

        if (state.selectedBeneficiary?.id === action.payload) {
          state.selectedBeneficiary = null;
        }
      })

      .addCase(deleteBeneficiary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearBeneficiaryError,
  clearSelectedBeneficiary,
} = beneficiarySlice.actions;

export default beneficiarySlice.reducer;