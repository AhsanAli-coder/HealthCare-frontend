import { API_BASE_URL } from "../config/env.js";

function isObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getTokens() {
  try {
    const raw = localStorage.getItem("auth_tokens");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setTokens(tokens) {
  localStorage.setItem("auth_tokens", JSON.stringify(tokens));
}

export function clearTokens() {
  localStorage.removeItem("auth_tokens");
}

async function parseJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function refreshAccessToken(refreshToken) {
  const res = await fetch(`${API_BASE_URL}/users/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw new ApiError("Refresh token failed", { status: res.status, data });
  }
  return data;
}

/**
 * Minimal fetch wrapper:
 * - adds Authorization header if accessToken exists
 * - retries once on 401 by calling refresh-token
 */
export async function apiFetch(path, { headers, retry401 = true, ...init } = {}) {
  const tokens = getTokens();
  const accessToken = tokens?.accessToken;

  const mergedHeaders = new Headers(headers ?? {});
  if (accessToken) mergedHeaders.set("Authorization", `Bearer ${accessToken}`);

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: mergedHeaders,
  });

  if (res.status === 401 && retry401 && tokens?.refreshToken) {
    try {
      const refreshed = await refreshAccessToken(tokens.refreshToken);

      // Support common response shapes:
      // { accessToken, refreshToken } OR { data: { accessToken, refreshToken } }
      const next =
        (isObject(refreshed) && isObject(refreshed.data) ? refreshed.data : refreshed) ??
        {};

      const newTokens = {
        accessToken: next.accessToken ?? accessToken ?? "",
        refreshToken: next.refreshToken ?? tokens.refreshToken ?? "",
      };
      setTokens(newTokens);

      const retryHeaders = new Headers(headers ?? {});
      if (newTokens.accessToken) {
        retryHeaders.set("Authorization", `Bearer ${newTokens.accessToken}`);
      }

      const retryRes = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: retryHeaders,
      });
      const retryData = await parseJsonSafe(retryRes);
      if (!retryRes.ok) {
        throw new ApiError("Request failed", {
          status: retryRes.status,
          data: retryData,
        });
      }
      return retryData;
    } catch {
      clearTokens();
    }
  }

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw new ApiError("Request failed", { status: res.status, data });
  }
  return data;
}

export function persistTokens({ accessToken, refreshToken }) {
  setTokens({ accessToken, refreshToken });
}

