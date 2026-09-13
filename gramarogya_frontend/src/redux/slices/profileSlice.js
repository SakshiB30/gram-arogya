import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import profileService from "../../services/profileService";
import { normalizeApiError } from "../../utils/apiError";

// ===========================
// GET PROFILE
// ===========================
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (_, thunkAPI) => {
    try {
      return await profileService.getProfile();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(error, "Failed to fetch profile.")
      );
    }
  }
);

// ===========================
// UPDATE PROFILE
// ===========================
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (profileData, thunkAPI) => {
    try {
      return await profileService.updateProfile(profileData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(error, "Failed to update profile.")
      );
    }
  }
);

const initialState = {
  profile: null,
  loading: false,
  success: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,

  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },

    clearProfileSuccess: (state) => {
      state.success = false;
    },
  },

  extraReducers: (builder) => {
    builder

      // ===========================
      // FETCH PROFILE
      // ===========================
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })

      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ===========================
      // UPDATE PROFILE
      // ===========================
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.success = true;
      })

      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearProfileError,
  clearProfileSuccess,
} = profileSlice.actions;

export default profileSlice.reducer;
