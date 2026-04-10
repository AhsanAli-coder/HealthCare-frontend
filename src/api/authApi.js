import { API_BASE_URL } from "../config/env.js";
import { AUTH_ACCESS_TOKEN_KEY } from "../constants/authStorage.js";
import { apiFetch } from "./http.js";

//sometimes backend returns extra data=>we aonly keep tokens
function pick(obj, keys) {
  if (!obj || typeof obj !== "object") return {};
  const out = {};
  for (const k of keys) if (obj[k] != null) out[k] = obj[k];
  return out;
}

//✔ If data exists → return data.data
//✔ Else → return original object

function unwrap(data) {
  // Accept: { data: ... } or direct payload
  if (data && typeof data === "object" && "data" in data) return data.data;
  return data;
}

function extractTokens(payload) {
  const p = unwrap(payload) ?? {};
  const { accessToken, refreshToken } = p;
  if (accessToken || refreshToken) return { accessToken, refreshToken };
  // Accept nested token objects too
  if (p.tokens) return pick(p.tokens, ["accessToken", "refreshToken"]);
  return { accessToken: undefined, refreshToken: undefined };
}

function extractUser(payload) {
  const p = unwrap(payload) ?? {};
  return p.user ?? p.profile ?? p;
}

export async function login({ email, password }) {
  const payload = await apiFetch("/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    retry401: false,
  });

  return {
    user: extractUser(payload),
    tokens: extractTokens(payload),
    raw: payload,
  };
}

export async function registerMultipart({
  name,
  email,
  password,
  phone,
  role,
}) {
  const fd = new FormData();
  fd.append("name", name);
  fd.append("email", email);
  fd.append("password", password);
  fd.append("phone", phone);
  fd.append("role", role);

  const payload = await apiFetch("/users/register", {
    method: "POST",
    body: fd,
    retry401: false,
  });

  return {
    user: extractUser(payload),
    tokens: extractTokens(payload),
    raw: payload,
  };
}

export async function logout() {
  // backend expects auth header, apiFetch will attach
  const payload = await apiFetch("/users/logout", {
    method: "POST",
  });
  return payload;
}

/**
 * Uses refresh httpOnly cookie; returns accessToken from JSON body for Socket.IO auth.
 * Does not use apiFetch (avoid 401 retry loops).
 */
export async function refreshAccessToken() {
  const res = await fetch(`${API_BASE_URL}/users/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      data?.message ??
      data?.data?.message ??
      (typeof data === "string" ? data : null) ??
      "Refresh failed";
    throw new Error(msg);
  }
  const inner = data?.data ?? data;
  const accessToken = inner?.accessToken;
  if (accessToken && typeof window !== "undefined") {
    try {
      sessionStorage.setItem(AUTH_ACCESS_TOKEN_KEY, accessToken);
    } catch {
      /* ignore */
    }
  }
  return accessToken ?? null;
}
