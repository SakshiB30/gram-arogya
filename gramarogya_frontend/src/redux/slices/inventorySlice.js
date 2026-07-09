import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import inventoryService from "../../services/inventoryService";

// =======================
// GET ALL MEDICINES
// =======================
export const getInventory = createAsyncThunk(
  "inventory/getAll",
  async (_, thunkAPI) => {
    try {
      return await inventoryService.getInventory();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// =======================
// GET MEDICINE BY ID
// =======================
export const getMedicineById = createAsyncThunk(
  "inventory/getById",
  async (id, thunkAPI) => {
    try {
      return await inventoryService.getMedicineById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// =======================
// ADD MEDICINE
// =======================
export const addMedicine = createAsyncThunk(
  "inventory/add",
  async (medicineData, thunkAPI) => {
    try {
      return await inventoryService.addMedicine(medicineData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// =======================
// UPDATE MEDICINE
// =======================
export const updateMedicine = createAsyncThunk(
  "inventory/update",
  async ({ id, medicineData }, thunkAPI) => {
    try {
      return await inventoryService.updateMedicine(id, medicineData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// =======================
// RESTOCK MEDICINE
// =======================
export const restockMedicine = createAsyncThunk(
  "inventory/restock",
  async ({ id, quantity }, thunkAPI) => {
    try {
      return await inventoryService.restockMedicine(id, quantity);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// =======================
// DELETE MEDICINE
// =======================
export const deleteMedicine = createAsyncThunk(
  "inventory/delete",
  async (id, thunkAPI) => {
    try {
      await inventoryService.deleteMedicine(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

const initialState = {
  medicines: [],
  medicine: null,
  loading: false,
  success: false,
  error: null,
};

const inventorySlice = createSlice({
  name: "inventory",
  initialState,

  reducers: {
    resetInventoryState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.medicine = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= GET ALL =================
      .addCase(getInventory.pending, (state) => {
        state.loading = true;
      })
      .addCase(getInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.medicines = action.payload;
      })
      .addCase(getInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= GET BY ID =================
      .addCase(getMedicineById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMedicineById.fulfilled, (state, action) => {
        state.loading = false;
        state.medicine = action.payload;
      })
      .addCase(getMedicineById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= ADD =================
      .addCase(addMedicine.pending, (state) => {
        state.loading = true;
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

      // ================= UPDATE =================
      .addCase(updateMedicine.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.medicines = state.medicines.map((medicine) =>
          medicine.id === action.payload.id ? action.payload : medicine
        );
      })
      .addCase(updateMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= RESTOCK =================
      .addCase(restockMedicine.pending, (state) => {
        state.loading = true;
      })
      .addCase(restockMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.medicines = state.medicines.map((medicine) =>
          medicine.id === action.payload.id ? action.payload : medicine
        );
      })
      .addCase(restockMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= DELETE =================
      .addCase(deleteMedicine.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMedicine.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;

        state.medicines = state.medicines.filter(
          (medicine) => medicine.id !== action.payload
        );
      })
      .addCase(deleteMedicine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const{
  resetInventoryState
  
  } = inventorySlice.actions;

export default inventorySlice.reducer;