import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import healthRecordService from "../../services/healthRecordService";


// Get All
export const fetchHealthRecords = createAsyncThunk(
  "healthRecords/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await healthRecordService.getAllHealthRecords();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch health records"
      );
    }
  }
);

// Get By Id
export const fetchHealthRecordById = createAsyncThunk(
  "healthRecords/fetchById",
  async (id, thunkAPI) => {
    try {
      return await healthRecordService.getHealthRecordById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch health record"
      );
    }
  }
);

// Create
export const createHealthRecord = createAsyncThunk(
  "healthRecords/create",
  async (healthRecord, thunkAPI) => {
    try {
      return await healthRecordService.createHealthRecord(healthRecord);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create health record"
      );
    }
  }
);

// Update
export const updateHealthRecord = createAsyncThunk(
  "healthRecords/update",
  async ({ id, healthRecord }, thunkAPI) => {
    try {
      return await healthRecordService.updateHealthRecord(id, healthRecord);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update health record"
      );
    }
  }
);

// Delete
export const deleteHealthRecord = createAsyncThunk(
  "healthRecords/delete",
  async (id, thunkAPI) => {
    try {
      await healthRecordService.deleteHealthRecord(id);
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete health record"
      );
    }
  }
);

const healthRecordSlice = createSlice({
  name: "healthRecords",
  initialState: {
    healthRecords: [],
    selectedHealthRecord: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedHealthRecord: (state) => {
      state.selectedHealthRecord = null;
    },
    clearHealthRecordError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchHealthRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHealthRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.healthRecords = action.payload;
      })
      .addCase(fetchHealthRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch By Id
      .addCase(fetchHealthRecordById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHealthRecordById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedHealthRecord = action.payload;
      })
      .addCase(fetchHealthRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createHealthRecord.fulfilled, (state, action) => {
        state.healthRecords.push(action.payload);
      })

      // Update
      .addCase(updateHealthRecord.fulfilled, (state, action) => {
        const index = state.healthRecords.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.healthRecords[index] = action.payload;
        }

        state.selectedHealthRecord = action.payload;
      })

      // Delete
      .addCase(deleteHealthRecord.fulfilled, (state, action) => {
        state.healthRecords = state.healthRecords.filter(
          (item) => item.id !== action.payload
        );
      });
  },
});

export const {
  clearSelectedHealthRecord,
  clearHealthRecordError,
} = healthRecordSlice.actions;

export default healthRecordSlice.reducer;