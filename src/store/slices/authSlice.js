import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "../../api/authApi.js";
import { clearTokens } from "../../api/http.js";

const initialState = {
  user: null,
  role: null,
  accessToken: null,
  refreshToken: null,
  status: "idle",
  error: null,
};

function safeRole(user) {
  if (!user || typeof user !== "object") return null;
  return user.role ?? user.userRole ?? user.type ?? null;
}

function readPersistedTokens() {
  try {
    const raw = localStorage.getItem("auth_tokens");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const hydrateAuth = createAsyncThunk("auth/hydrate", async () => {
  const tokens = readPersistedTokens();
  return { tokens };
});

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
      clearTokens();
      return true;
    } catch (e) {
      clearTokens();
      return rejectWithValue(e?.data ?? e?.message ?? "Logout failed");
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken, refreshToken, role } = action.payload;
      state.user = user ?? null;
      state.accessToken = accessToken ?? null;
      state.refreshToken = refreshToken ?? null;
      state.role = role ?? safeRole(user) ?? null;
    },
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrateAuth.fulfilled, (state, action) => {
        const tokens = action.payload?.tokens;
        state.accessToken = tokens?.accessToken ?? null;
        state.refreshToken = tokens?.refreshToken ?? null;
      })
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { user, tokens } = action.payload ?? {};
        state.status = "succeeded";
        state.user = user ?? null;
        state.accessToken = tokens?.accessToken ?? state.accessToken;
        state.refreshToken = tokens?.refreshToken ?? state.refreshToken;
        state.role = safeRole(user) ?? state.role;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? action.error?.message ?? "Login failed";
      })
      .addCase(registerThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        const { user, tokens } = action.payload ?? {};
        state.status = "succeeded";
        state.user = user ?? null;
        state.accessToken = tokens?.accessToken ?? state.accessToken;
        state.refreshToken = tokens?.refreshToken ?? state.refreshToken;
        state.role = safeRole(user) ?? state.role;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error?.message ?? "Registration failed";
      })
      .addCase(logoutThunk.fulfilled, () => initialState)
      .addCase(logoutThunk.rejected, () => initialState);
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
