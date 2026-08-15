import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import healthRecordService from "../../services/healthRecordService";


// =====================================================
// GET ALL HEALTH RECORDS
// =====================================================

export const fetchHealthRecords = createAsyncThunk(
  "healthRecords/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await healthRecordService.getAllHealthRecords();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch health records"
      );
    }
  }
);


// =====================================================
// GET HEALTH RECORD BY ID
// =====================================================

export const fetchHealthRecordById = createAsyncThunk(
  "healthRecords/fetchById",
  async (id, thunkAPI) => {
    try {
      return await healthRecordService.getHealthRecordById(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch health record"
      );
    }
  }
);


// =====================================================
// GET HEALTH RECORDS BY BENEFICIARY
// =====================================================

export const fetchHealthRecordsByBeneficiary = createAsyncThunk(
  "healthRecords/fetchByBeneficiary",
  async (beneficiaryId, thunkAPI) => {
    try {
      return await healthRecordService.getHealthRecordsByBeneficiary(
        beneficiaryId
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch beneficiary health records"
      );
    }
  }
);


// =====================================================
// GET HEALTH RECORDS BY VISIT
// =====================================================

export const fetchHealthRecordsByVisit = createAsyncThunk(
  "healthRecords/fetchByVisit",
  async (visitId, thunkAPI) => {
    try {
      return await healthRecordService.getHealthRecordsByVisit(
        visitId
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch visit health records"
      );
    }
  }
);


// =====================================================
// CREATE HEALTH RECORD
// =====================================================

export const createHealthRecord = createAsyncThunk(
  "healthRecords/create",
  async (healthRecord, thunkAPI) => {
    try {
      return await healthRecordService.createHealthRecord(
        healthRecord
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to create health record"
      );
    }
  }
);


// =====================================================
// UPDATE HEALTH RECORD
// =====================================================

export const updateHealthRecord = createAsyncThunk(
  "healthRecords/update",
  async ({ id, healthRecord }, thunkAPI) => {
    try {
      return await healthRecordService.updateHealthRecord(
        id,
        healthRecord
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to update health record"
      );
    }
  }
);


// =====================================================
// DELETE HEALTH RECORD
// =====================================================

export const deleteHealthRecord = createAsyncThunk(
  "healthRecords/delete",
  async (id, thunkAPI) => {
    try {
      await healthRecordService.deleteHealthRecord(id);

      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Failed to delete health record"
      );
    }
  }
);


// =====================================================
// INITIAL STATE
// =====================================================

const initialState = {
  healthRecords: [],
  selectedHealthRecord: null,

  loading: false,
  error: null,

  actionLoading: false,
  actionError: null,
};


// =====================================================
// SLICE
// =====================================================

const healthRecordSlice = createSlice({
  name: "healthRecords",

  initialState,

  reducers: {

    clearSelectedHealthRecord: (state) => {
      state.selectedHealthRecord = null;
    },

    clearHealthRecordError: (state) => {
      state.error = null;
      state.actionError = null;
    },
  },


  extraReducers: (builder) => {

    // ===================================================
    // FETCH ALL
    // ===================================================

    builder

      .addCase(fetchHealthRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHealthRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.healthRecords = action.payload || [];
      })

      .addCase(fetchHealthRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    // ===================================================
    // FETCH BY ID
    // ===================================================

    builder

      .addCase(fetchHealthRecordById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchHealthRecordById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedHealthRecord = action.payload;
      })

      .addCase(fetchHealthRecordById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });


    // ===================================================
    // FETCH BY BENEFICIARY
    // ===================================================

    builder

      .addCase(
        fetchHealthRecordsByBeneficiary.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchHealthRecordsByBeneficiary.fulfilled,
        (state, action) => {
          state.loading = false;
          state.healthRecords = action.payload || [];
        }
      )

      .addCase(
        fetchHealthRecordsByBeneficiary.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );


    // ===================================================
    // FETCH BY VISIT
    // ===================================================

    builder

      .addCase(
        fetchHealthRecordsByVisit.pending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )

      .addCase(
        fetchHealthRecordsByVisit.fulfilled,
        (state, action) => {
          state.loading = false;
          state.healthRecords = action.payload || [];
        }
      )

      .addCase(
        fetchHealthRecordsByVisit.rejected,
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );


    // ===================================================
    // CREATE
    // ===================================================

    builder

      .addCase(createHealthRecord.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })

      .addCase(createHealthRecord.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.healthRecords.unshift(action.payload);

        state.selectedHealthRecord = action.payload;
      })

      .addCase(createHealthRecord.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });


    // ===================================================
    // UPDATE
    // ===================================================

    builder

      .addCase(updateHealthRecord.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })

      .addCase(updateHealthRecord.fulfilled, (state, action) => {
        state.actionLoading = false;

        const index = state.healthRecords.findIndex(
          (item) => item.id === action.payload.id
        );

        if (index !== -1) {
          state.healthRecords[index] = action.payload;
        }

        state.selectedHealthRecord = action.payload;
      })

      .addCase(updateHealthRecord.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });


    // ===================================================
    // DELETE
    // ===================================================

    builder

      .addCase(deleteHealthRecord.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })

      .addCase(deleteHealthRecord.fulfilled, (state, action) => {
        state.actionLoading = false;

        state.healthRecords =
          state.healthRecords.filter(
            (item) => item.id !== action.payload
          );

        if (
          state.selectedHealthRecord?.id === action.payload
        ) {
          state.selectedHealthRecord = null;
        }
      })

      .addCase(deleteHealthRecord.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});


export const {
  clearSelectedHealthRecord,
  clearHealthRecordError,
} = healthRecordSlice.actions;


export default healthRecordSlice.reducer;