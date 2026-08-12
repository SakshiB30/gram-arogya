import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import inventoryService from "../../services/inventoryService";

// ===========================
// GET ALL MEDICINES
// ===========================
export const getInventory = createAsyncThunk(
  "inventory/getInventory",
  async (_, thunkAPI) => {
    try {
      return await inventoryService.getInventory();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch inventory";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ===========================
// GET MEDICINE BY ID
// ===========================
export const getMedicineById = createAsyncThunk(
  "inventory/getMedicineById",
  async (id, thunkAPI) => {
    try {
      return await inventoryService.getMedicineById(id);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch medicine";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ===========================
// ADD MEDICINE
// ===========================
export const addMedicine = createAsyncThunk(
  "inventory/addMedicine",
  async (medicineData, thunkAPI) => {
    try {
      return await inventoryService.addMedicine(medicineData);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to add medicine";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ===========================
// UPDATE MEDICINE
// ===========================
export const updateMedicine = createAsyncThunk(
  "inventory/updateMedicine",
  async ({ id, medicineData }, thunkAPI) => {
    try {
      return await inventoryService.updateMedicine(
        id,
        medicineData
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to update medicine";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ===========================
// RECEIVE / RESTOCK MEDICINE
// ===========================
export const receiveMedicine = createAsyncThunk(
  "inventory/receiveMedicine",
  async ({ id, quantity }, thunkAPI) => {
    try {
      return await inventoryService.receiveMedicine(
        id,
        quantity
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to restock medicine";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ===========================
// ISSUE MEDICINE
// ===========================
export const issueMedicine = createAsyncThunk(
  "inventory/issueMedicine",
  async ({ id, issueData }, thunkAPI) => {
    try {
      return await inventoryService.issueMedicine(
        id,
        issueData
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to issue medicine";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ===========================
// DELETE MEDICINE
// ===========================
export const deleteMedicine = createAsyncThunk(
  "inventory/deleteMedicine",
  async (id, thunkAPI) => {
    try {
      await inventoryService.deleteMedicine(id);

      // Return ID so reducer can remove it
      // from medicines array
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to delete medicine";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ===========================
// GET ALL STOCK LOGS
// ===========================
export const getStockLogs = createAsyncThunk(
  "inventory/getStockLogs",
  async (_, thunkAPI) => {
    try {
      return await inventoryService.getStockLogs();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch stock logs";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ===========================
// GET MEDICINE STOCK LOGS
// ===========================
export const getMedicineLogs = createAsyncThunk(
  "inventory/getMedicineLogs",
  async (id, thunkAPI) => {
    try {
      return await inventoryService.getMedicineLogs(id);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch medicine logs";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ===========================
// GET ALL ISSUED MEDICINES
// ===========================
export const getIssuedMedicines = createAsyncThunk(
  "inventory/getIssuedMedicines",
  async (_, thunkAPI) => {
    try {
      return await inventoryService.getIssuedMedicines();
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch issued medicines";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ===========================
// GET BENEFICIARY MEDICINE HISTORY
// ===========================
export const getBeneficiaryMedicineHistory = createAsyncThunk(
  "inventory/getBeneficiaryMedicineHistory",
  async (beneficiaryId, thunkAPI) => {
    try {
      return await inventoryService.getBeneficiaryMedicineHistory(
        beneficiaryId
      );
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch beneficiary medicine history";

      return thunkAPI.rejectWithValue(message);
    }
  }
);

// ===========================
// INITIAL STATE
// ===========================
const initialState = {
  medicines: [],
  medicine: null,

  // Issue related data
  issuedMedicines: [],
  beneficiaryMedicineHistory: [],

  // Logs
  logs: [],
  medicineLogs: [],

  loading: false,
  success: false,
  error: null,
};

// ===========================
// SLICE
// ===========================
const inventorySlice = createSlice({
  name: "inventory",
  initialState,

  reducers: {
    // ===========================
    // CLEAR ERROR
    // ===========================
    clearInventoryError: (state) => {
      state.error = null;
    },

    // ===========================
    // CLEAR SUCCESS
    // ===========================
    clearInventorySuccess: (state) => {
      state.success = false;
    },

    // ===========================
    // RESET INVENTORY STATE
    // ===========================
    resetInventoryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.medicine = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ==================================================
      // GET ALL MEDICINES
      // ==================================================
      .addCase(getInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload;
      })

      .addCase(getInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // GET MEDICINE BY ID
      // ==================================================
      .addCase(getMedicineById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMedicineById.fulfilled, (state, action) => {
        state.loading = false;
        state.medicine = action.payload;
      })

      .addCase(getMedicineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // ADD MEDICINE
      // ==================================================
      .addCase(addMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(addMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.medicines.push(action.payload);
      })

      .addCase(addMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // UPDATE MEDICINE
      // ==================================================
      .addCase(updateMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.medicines = state.medicines.map((medicine) =>
          medicine.id === action.payload.id
            ? action.payload
            : medicine
        );

        state.medicine = action.payload;
      })

      .addCase(updateMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // RECEIVE / RESTOCK MEDICINE
      // ==================================================
      .addCase(receiveMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(receiveMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.medicines = state.medicines.map((medicine) =>
          medicine.id === action.payload.id
            ? action.payload
            : medicine
        );

        state.medicine = action.payload;
      })

      .addCase(receiveMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // ISSUE MEDICINE
      // ==================================================
      .addCase(issueMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(issueMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        /*
         * Backend returns MedicineIssueResponseDto.
         *
         * It contains:
         * medicineId
         * medicineName
         * beneficiaryId
         * beneficiaryName
         * quantity
         * reason
         * issuedBy
         * issuedByRole
         * issuedAt
         *
         * We add the issue record to the issued medicines list.
         */
        state.issuedMedicines.unshift(action.payload);

        /*
         * We do NOT directly modify stock here because
         * the backend should be responsible for decreasing
         * stock.
         *
         * Refresh inventory after issuing medicine if you
         * want the latest stock value.
         */
      })

      .addCase(issueMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // DELETE MEDICINE
      // ==================================================
      .addCase(deleteMedicine.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.medicines = state.medicines.filter(
          (medicine) => medicine.id !== action.payload
        );

        if (state.medicine?.id === action.payload) {
          state.medicine = null;
        }
      })

      .addCase(deleteMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // GET ALL STOCK LOGS
      // ==================================================
      .addCase(getStockLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getStockLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })

      .addCase(getStockLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // GET MEDICINE STOCK LOGS
      // ==================================================
      .addCase(getMedicineLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMedicineLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.medicineLogs = action.payload;
      })

      .addCase(getMedicineLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // GET ALL ISSUED MEDICINES
      // ==================================================
      .addCase(getIssuedMedicines.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getIssuedMedicines.fulfilled, (state, action) => {
        state.loading = false;
        state.issuedMedicines = action.payload;
      })

      .addCase(getIssuedMedicines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ==================================================
      // GET BENEFICIARY MEDICINE HISTORY
      // ==================================================
      .addCase(
        getBeneficiaryMedicineHistory.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        getBeneficiaryMedicineHistory.fulfilled,
        (state, action) => {
          state.loading = false;
          state.beneficiaryMedicineHistory =
            action.payload;
        }
      )

      .addCase(
        getBeneficiaryMedicineHistory.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

// ===========================
// EXPORT ACTIONS
// ===========================
export const {
  clearInventoryError,
  clearInventorySuccess,
  resetInventoryState,
} = inventorySlice.actions;

// ===========================
// EXPORT REDUCER
// ===========================
export default inventorySlice.reducer;
