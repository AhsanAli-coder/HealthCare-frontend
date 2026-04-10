import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import * as authApi from "../../api/authApi.js";
import { AUTH_ACCESS_TOKEN_KEY } from "../../constants/authStorage.js";

function loadAccessTokenFromStorage() {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(AUTH_ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

function emptyAuthState() {
  return {
    user: null,
    role: null,
    status: "idle",
    error: null,
    isAuthenticated: false,
    accessToken: null,
  };
}

const initialState = {
  ...emptyAuthState(),
  accessToken: loadAccessTokenFromStorage(),
};

function safeRole(user) {
  if (!user || typeof user !== "object") return null;
  return user.role ?? user.userRole ?? user.type ?? null;
}

function persistAccessToken(token) {
  if (typeof window === "undefined") return;
  try {
    if (token) sessionStorage.setItem(AUTH_ACCESS_TOKEN_KEY, token);
    else sessionStorage.removeItem(AUTH_ACCESS_TOKEN_KEY);
  } catch {
    /* ignore */
  }
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
    setAccessToken: (state, action) => {
      const t = action.payload ?? null;
      state.accessToken = t;
      persistAccessToken(t);
    },
    logout: () => {
      persistAccessToken(null);
      return emptyAuthState();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        const { user, tokens } = action.payload ?? {};
        state.status = "succeeded";
        state.user = user ?? null;
        state.role = safeRole(user) ?? state.role;
        state.isAuthenticated = true;
        const at = tokens?.accessToken;
        if (at) {
          state.accessToken = at;
          persistAccessToken(at);
        }
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
        const { user, tokens } = action.payload ?? {};
        state.status = "succeeded";
        state.user = user ?? null;
        state.role = safeRole(user) ?? state.role;
        state.isAuthenticated = true;
        const at = tokens?.accessToken;
        if (at) {
          state.accessToken = at;
          persistAccessToken(at);
        }
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload ?? action.error?.message ?? "Registration failed";
        state.isAuthenticated = false;
      })
      .addCase(logoutThunk.fulfilled, () => {
        persistAccessToken(null);
        return emptyAuthState();
      })
      .addCase(logoutThunk.rejected, () => {
        persistAccessToken(null);
        return emptyAuthState();
      });
  },
});

export const { setCredentials, setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
