import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ashaService from "../../services/ashaService";

export const registerAsha = createAsyncThunk(
  "asha/register",
  async (userData, thunkAPI) => {
    try {
      return await ashaService.register(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Registration Failed"
      );
    }
  }
);

const initialState = {
  loading: false,
  success: false,
  error: null,
};

const ashaSlice = createSlice({
  name: "asha",

  initialState,

  reducers: {

    clearAshaError(state) {
      state.error = null;
    },

    resetAshaState(state) {
      state.loading = false;
      state.success = false;
      state.error = null;
    },

  },

  extraReducers: (builder) => {

    builder

      .addCase(registerAsha.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(registerAsha.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })

      .addCase(registerAsha.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  }

});

export const {
  clearAshaError,
  resetAshaState
} = ashaSlice.actions;

export default ashaSlice.reducer;