import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import beneficiaryService from "../../services/beneficiaryService";
import { normalizeApiError } from "../../utils/apiError";

import {
  saveBeneficiariesOffline,
  getOfflineBeneficiaries,
  getOfflineBeneficiaryById,
} from "../../offline/beneficiaryOfflineService";

import { isOnline } from "../../offline/network";

/**
 * Fetch all beneficiaries
 *
 * Online:
 *   Backend → save local copy → Redux
 *
 * Offline:
 *   IndexedDB → Redux
 */
export const fetchBeneficiaries = createAsyncThunk(
  "beneficiaries/fetchAll",
  async (_, thunkAPI) => {
    try {
      const user = JSON.parse(
        localStorage.getItem("user")
      );

      if (!user?.id) {
        throw new Error(
          "Logged-in user not found."
        );
      }

      if (isOnline()) {
        /*
         * Fetch ASHA's assigned beneficiaries
         * from backend.
         *
         * Backend already applies role-based
         * access control.
         */
        const beneficiaries =
          await beneficiaryService.getAllBeneficiaries();

        /*
         * Save a local copy for offline use.
         */
        await saveBeneficiariesOffline(
          beneficiaries
        );

        return beneficiaries;
      }

      /*
       * Offline mode:
       * Get beneficiaries from IndexedDB.
       */
      const offlineBeneficiaries =
        await getOfflineBeneficiaries(
          user.id
        );

      return offlineBeneficiaries;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(
          error,
          "Failed to fetch beneficiaries."
        )
      );
    }
  }
);

/**
 * Fetch one beneficiary by ID
 *
 * Online:
 *   Backend → save local copy → Redux
 *
 * Offline:
 *   IndexedDB → Redux
 */
export const fetchBeneficiaryById =
  createAsyncThunk(
    "beneficiaries/fetchById",
    async (id, thunkAPI) => {
      try {
        if (!id) {
          throw new Error(
            "Beneficiary ID is required."
          );
        }

        if (isOnline()) {
          /*
           * Fetch from backend.
           */
          const beneficiary =
            await beneficiaryService
              .getBeneficiaryById(id);

          /*
           * Keep a local copy.
           */
          await saveBeneficiariesOffline([
            beneficiary,
          ]);

          return beneficiary;
        }

        /*
         * Offline mode.
         */
        const beneficiary =
          await getOfflineBeneficiaryById(id);

        if (!beneficiary) {
          throw new Error(
            "Beneficiary not found offline."
          );
        }

        return beneficiary;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          normalizeApiError(
            error,
            "Failed to fetch beneficiary."
          )
        );
      }
    }
  );

/**
 * Get available ASHAs
 *
 * This is an online-only operation.
 *
 * It is mainly used by ANM/Admin workflows
 * and is NOT part of ASHA offline functionality.
 */
export const fetchAvailableAshas =
  createAsyncThunk(
    "beneficiaries/fetchAvailableAshas",
    async (_, thunkAPI) => {
      try {
        const ashAs =
          await beneficiaryService
            .getAvailableAshas();

        return ashAs;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          normalizeApiError(
            error,
            "Failed to fetch available ASHAs."
          )
        );
      }
    }
  );

/**
 * Create beneficiary
 *
 * Beneficiary CRUD is currently online-only.
 *
 * Offline beneficiary creation is intentionally
 * NOT implemented because the current offline
 * scope is:
 *
 * Assigned Beneficiaries
 * Visits
 * Health Records
 */
export const createBeneficiary =
  createAsyncThunk(
    "beneficiaries/create",
    async (beneficiaryData, thunkAPI) => {
      try {
        const beneficiary =
          await beneficiaryService
            .createBeneficiary(
              beneficiaryData
            );

        return beneficiary;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          normalizeApiError(
            error,
            "Failed to create beneficiary."
          )
        );
      }
    }
  );

/**
 * Update beneficiary
 *
 * Currently online-only.
 */
export const updateBeneficiary =
  createAsyncThunk(
    "beneficiaries/update",
    async (
      { id, beneficiaryData },
      thunkAPI
    ) => {
      try {
        const beneficiary =
          await beneficiaryService
            .updateBeneficiary(
              id,
              beneficiaryData
            );

        return beneficiary;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          normalizeApiError(
            error,
            "Failed to update beneficiary."
          )
        );
      }
    }
  );

/**
 * Delete beneficiary
 *
 * Currently online-only.
 */
export const deleteBeneficiary =
  createAsyncThunk(
    "beneficiaries/delete",
    async (id, thunkAPI) => {
      try {
        await beneficiaryService
          .deleteBeneficiary(id);

        return id;
      } catch (error) {
        return thunkAPI.rejectWithValue(
          normalizeApiError(
            error,
            "Failed to delete beneficiary."
          )
        );
      }
    }
  );

/**
 * Initial state
 */
const initialState = {
  beneficiaries: [],
  selectedBeneficiary: null,

  availableAshas: [],

  loading: false,
  error: null,

  actionLoading: false,
  actionError: null,
};

/**
 * Beneficiary Slice
 */
const beneficiarySlice = createSlice({
  name: "beneficiaries",

  initialState,

  reducers: {
    clearBeneficiaryError: (state) => {
      state.error = null;
    },

    clearBeneficiaryActionError: (state) => {
      state.actionError = null;
    },

    clearSelectedBeneficiary: (state) => {
      state.selectedBeneficiary = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // =========================================
      // FETCH ALL BENEFICIARIES
      // =========================================

      .addCase(
        fetchBeneficiaries.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchBeneficiaries.fulfilled,
        (state, action) => {
          state.loading = false;

          state.beneficiaries =
            action.payload;
        }
      )

      .addCase(
        fetchBeneficiaries.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // =========================================
      // FETCH BENEFICIARY BY ID
      // =========================================

      .addCase(
        fetchBeneficiaryById.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchBeneficiaryById.fulfilled,
        (state, action) => {
          state.loading = false;

          state.selectedBeneficiary =
            action.payload;
        }
      )

      .addCase(
        fetchBeneficiaryById.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // =========================================
      // FETCH AVAILABLE ASHAS
      // =========================================

      .addCase(
        fetchAvailableAshas.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchAvailableAshas.fulfilled,
        (state, action) => {
          state.loading = false;

          state.availableAshas =
            action.payload;
        }
      )

      .addCase(
        fetchAvailableAshas.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      )

      // =========================================
      // CREATE BENEFICIARY
      // =========================================

      .addCase(
        createBeneficiary.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
        }
      )

      .addCase(
        createBeneficiary.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.beneficiaries.push(
            action.payload
          );
        }
      )

      .addCase(
        createBeneficiary.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.actionError = action.payload;
        }
      )

      // =========================================
      // UPDATE BENEFICIARY
      // =========================================

      .addCase(
        updateBeneficiary.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
        }
      )

      .addCase(
        updateBeneficiary.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          const index =
            state.beneficiaries.findIndex(
              (beneficiary) =>
                beneficiary.id ===
                action.payload.id
            );

          if (index !== -1) {
            state.beneficiaries[index] =
              action.payload;
          }

          if (
            state.selectedBeneficiary?.id ===
            action.payload.id
          ) {
            state.selectedBeneficiary =
              action.payload;
          }
        }
      )

      .addCase(
        updateBeneficiary.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.actionError = action.payload;
        }
      )

      // =========================================
      // DELETE BENEFICIARY
      // =========================================

      .addCase(
        deleteBeneficiary.pending,
        (state) => {
          state.actionLoading = true;
          state.actionError = null;
        }
      )

      .addCase(
        deleteBeneficiary.fulfilled,
        (state, action) => {
          state.actionLoading = false;

          state.beneficiaries =
            state.beneficiaries.filter(
              (beneficiary) =>
                beneficiary.id !==
                action.payload
            );

          if (
            state.selectedBeneficiary?.id ===
            action.payload
          ) {
            state.selectedBeneficiary = null;
          }
        }
      )

      .addCase(
        deleteBeneficiary.rejected,
        (state, action) => {
          state.actionLoading = false;
          state.actionError = action.payload;
        }
      );
  },
});

export const {
  clearBeneficiaryError,
  clearBeneficiaryActionError,
  clearSelectedBeneficiary,
} = beneficiarySlice.actions;

export default beneficiarySlice.reducer;