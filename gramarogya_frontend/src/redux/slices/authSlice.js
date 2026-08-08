import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../../services/authService";


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
        error.response?.data?.message ||
          error.message ||
          "Invalid email or password"
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
        error.response?.data?.message ||
          error.message ||
          "Registration failed"
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
        error.response?.data?.message ||
          error.message ||
          "Registration failed"
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
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;
