import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminService from "../../services/adminService";

// ================= FETCH PENDING ANMS =================

export const fetchPendingAnms = createAsyncThunk(
  "admin/fetchPendingAnms",
  async (_, thunkAPI) => {
    try {
      return await adminService.getPendingAnms();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to load pending ANMs"
      );
    }
  }
);

// ================= FETCH ALL USERS =================

export const fetchAllUsers = createAsyncThunk(
  "admin/fetchAllUsers",
  async (_, thunkAPI) => {

    try {

      return await adminService.getAllUsers();

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to load users"
      );

    }

  }
);


// ================= APPROVE =================

export const approveAnm = createAsyncThunk(
  "admin/approveAnm",
  async (id, thunkAPI) => {
    try {
      return await adminService.approveAnm(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to approve ANM"
      );
    }
  }
);

// ================= REJECT =================

export const rejectAnm = createAsyncThunk(
  "admin/rejectAnm",
  async (id, thunkAPI) => {
    try {
      return await adminService.rejectAnm(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to reject ANM"
      );
    }
  }
);

// ================= BLOCK =================

export const blockAnm = createAsyncThunk(
  "admin/blockAnm",
  async (id, thunkAPI) => {
    try {
      return await adminService.blockAnm(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to block ANM"
      );
    }
  }
);


// ================= BLOCK ASHA =================

export const blockAsha = createAsyncThunk(
  "admin/blockAsha",
  async (id, thunkAPI) => {
    try {
      return await adminService.blockAsha(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to block ASHA"
      );
    }
  }
);

// ================= UNBLOCK ASHA =================

export const unblockAsha = createAsyncThunk(
  "admin/unblockAsha",
  async (id, thunkAPI) => {
    try {
      return await adminService.unblockAsha(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Failed to unblock ASHA"
      );
    }
  }
);

// ================= UNBLOCK =================

export const unblockAnm = createAsyncThunk(
  "admin/unblockAnm",
  async (id, thunkAPI) => {
    try {
      return await adminService.unblockAnm(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to unblock ANM"
      );
    }
  }
);

const initialState = {
  pendingAnms: [],
  allAnms: [],
  allAshas: [],
  allUsers: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: "admin",

  initialState,

  reducers: {
    clearAdminError(state) {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // ================= FETCH PENDING =================

      .addCase(fetchPendingAnms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchPendingAnms.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingAnms = action.payload;
      })

      .addCase(fetchPendingAnms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  

.addCase(fetchAllUsers.pending, (state) => {

  state.loading = true;
  state.error = null;

})

.addCase(fetchAllUsers.fulfilled, (state, action) => {

  state.loading = false;
  state.allUsers = action.payload;

})

.addCase(fetchAllUsers.rejected, (state, action) => {

  state.loading = false;
  state.error = action.payload;

})

      // ================= APPROVE =================

      .addCase(approveAnm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(approveAnm.fulfilled, (state, action) => {
        state.loading = false;

        state.pendingAnms = state.pendingAnms.filter(
          (anm) => anm.id !== action.payload.id
        );

        state.allAnms = state.allAnms.map((anm) =>
          anm.id === action.payload.id ? action.payload : anm
        );
      })

      .addCase(approveAnm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= REJECT =================

      .addCase(rejectAnm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(rejectAnm.fulfilled, (state, action) => {
        state.loading = false;

        state.pendingAnms = state.pendingAnms.filter(
          (anm) => anm.id !== action.payload.id
        );

        state.allAnms = state.allAnms.map((anm) =>
          anm.id === action.payload.id ? action.payload : anm
        );
      })

      .addCase(rejectAnm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= BLOCK =================

      .addCase(blockAnm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(blockAnm.fulfilled, (state, action) => {
  state.loading = false;

  state.allAnms = state.allAnms.map((anm) =>
    anm.id === action.payload.id ? action.payload : anm
  );

  state.allUsers = state.allUsers.map((user) =>
    user.id === action.payload.id ? action.payload : user
  );
})

      .addCase(blockAnm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= UNBLOCK =================

      .addCase(unblockAnm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(unblockAnm.fulfilled, (state, action) => {
  state.loading = false;

  state.allAnms = state.allAnms.map((anm) =>
    anm.id === action.payload.id ? action.payload : anm
  );

  state.allUsers = state.allUsers.map((user) =>
    user.id === action.payload.id ? action.payload : user
  );
})

      .addCase(unblockAnm.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ================= BLOCK ASHA =================

.addCase(blockAsha.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(blockAsha.fulfilled, (state, action) => {
  state.loading = false;

  state.allAshas = state.allAshas.map((asha) =>
    asha.id === action.payload.id ? action.payload : asha
  );

  state.allUsers = state.allUsers.map((user) =>
    user.id === action.payload.id ? action.payload : user
  );
})

.addCase(blockAsha.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})


// ================= UNBLOCK ASHA =================

.addCase(unblockAsha.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(unblockAsha.fulfilled, (state, action) => {
  state.loading = false;

  state.allAshas = state.allAshas.map((asha) =>
    asha.id === action.payload.id ? action.payload : asha
  );

  state.allUsers = state.allUsers.map((user) =>
    user.id === action.payload.id ? action.payload : user
  );
})

.addCase(unblockAsha.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
});

  },
});

export const { clearAdminError } = adminSlice.actions;

export default adminSlice.reducer;