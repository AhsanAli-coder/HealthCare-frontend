import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "../../api/authApi.js";

const initialState = {
  user: null,
  role: null,
  status: "idle",
  error: null,
  isAuthenticated: false,
};

function safeRole(user) {
  if (!user || typeof user !== "object") return null;
  return user.role ?? user.userRole ?? user.type ?? null;
}

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await authApi.login({ email, password });
    } catch (e) {
      return rejectWithValue(e?.data ?? e?.message ?? "Login failed");
    }
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (form, { rejectWithValue }) => {
    try {
      return await authApi.registerMultipart(form);
    } catch (e) {
      return rejectWithValue(e?.data ?? e?.message ?? "Registration failed");
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authApi.logout();
      return true;
    } catch (e) {
      return rejectWithValue(e?.data ?? e?.message ?? "Logout failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, role } = action.payload;
      state.user = user ?? null;
      state.role = role ?? safeRole(user) ?? null;
      state.isAuthenticated = Boolean(user);
    },
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { user } = action.payload ?? {};
        state.status = "succeeded";
        state.user = user ?? null;
        state.role = safeRole(user) ?? state.role;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error?.message ?? "Login failed";
        state.isAuthenticated = false;
      })
      .addCase(registerThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        const { user } = action.payload ?? {};
        state.status = "succeeded";
        state.user = user ?? null;
        state.role = safeRole(user) ?? state.role;
        state.isAuthenticated = true;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error?.message ?? "Registration failed";
        state.isAuthenticated = false;
      })
      .addCase(logoutThunk.fulfilled, () => initialState)
      .addCase(logoutThunk.rejected, () => initialState);
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
