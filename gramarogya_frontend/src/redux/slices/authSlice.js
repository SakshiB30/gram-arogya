import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";
import { normalizeApiError } from "../../utils/apiError";


export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.login(credentials);

      const user = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
      };

      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(user));

      return {
        token: response.token,
        user,
      };
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(error, "Invalid email or password.")
      );
    }
  }
);


export const registerAnm = createAsyncThunk(
  "auth/registerAnm",
  async (userData, thunkAPI) => {
    try {
      return await authService.registerAnm(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(error, "Registration failed.")
      );
    }
  }
);

export const registerAsha = createAsyncThunk(
  "auth/registerAsha",
  async (userData, thunkAPI) => {
    try {
      return await authService.registerAsha(userData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(error, "Registration failed.")
      );
    }
  }
);

export const sendForgotPasswordOtp = createAsyncThunk(
  "auth/sendForgotPasswordOtp",
  async (email, thunkAPI) => {
    try {
      return await authService.sendForgotPasswordOtp(email);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(error, "Unable to send OTP.")
      );
    }
  }
);

export const verifyForgotPasswordOtp = createAsyncThunk(
  "auth/verifyForgotPasswordOtp",
  async ({ email, code }, thunkAPI) => {
    try {
      return await authService.verifyForgotPasswordOtp(email, code);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(error, "Invalid or expired OTP.")
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ resetToken, newPassword }, thunkAPI) => {
    try {
      return await authService.resetPassword(resetToken, newPassword);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        normalizeApiError(error, "Unable to reset password.")
      );
    }
  }
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,

  isAuthenticated: !!localStorage.getItem("token"),

  loading: false,

  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        state.user = action.payload.user;

        state.token = action.payload.token;

        state.isAuthenticated = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload;
      })

      .addCase(registerAnm.pending, (state) => {
    state.loading = true;
    state.error = null;
})

.addCase(registerAnm.fulfilled, (state) => {
    state.loading = false;
})

.addCase(registerAnm.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
})

.addCase(registerAsha.pending, (state) => {
    state.loading = true;
    state.error = null;
})

.addCase(registerAsha.fulfilled, (state) => {
    state.loading = false;
})

.addCase(registerAsha.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload;
})

.addCase(sendForgotPasswordOtp.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(sendForgotPasswordOtp.fulfilled, (state) => {
  state.loading = false;
})

.addCase(sendForgotPasswordOtp.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

.addCase(verifyForgotPasswordOtp.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(verifyForgotPasswordOtp.fulfilled, (state) => {
  state.loading = false;
})

.addCase(verifyForgotPasswordOtp.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

.addCase(resetPassword.pending, (state) => {
  state.loading = true;
  state.error = null;
})

.addCase(resetPassword.fulfilled, (state) => {
  state.loading = false;
})

.addCase(resetPassword.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
