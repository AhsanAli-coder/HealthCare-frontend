import { API_BASE_URL } from "../config/env.js";

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
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

async function refreshAccessToken() {
  const res = await fetch(`${API_BASE_URL}/users/refresh-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // Backend uses httpOnly cookies; send them along.
    credentials: "include",
  });
  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw new ApiError("Refresh token failed", { status: res.status, data });
  }
  return data;
}

/**
 * Minimal fetch wrapper:
 * - sends cookies (httpOnly auth) with credentials: 'include'
 * - retries once on 401 by calling refresh-token (cookie-based)
 */


// Why we do it this way
// Centralizes API logic → don’t repeat fetch and token logic everywhere.
// Handles auth refresh automatically → smooth user experience.
// Provides consistent error handling.
export async function apiFetch(path, { headers, retry401 = true, ...init } = {}) {
  const mergedHeaders = new Headers(headers ?? {});

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: mergedHeaders,
    credentials: "include",
  });

  if (res.status === 401 && retry401) {
    try {
      await refreshAccessToken();
      const retryHeaders = new Headers(headers ?? {});
      const retryRes = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers: retryHeaders,
        credentials: "include",
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
      // If refresh fails, treat as logged out.
    }
  }

  const data = await parseJsonSafe(res);
  if (!res.ok) {
    throw new ApiError("Request failed", { status: res.status, data });
  }
  return data;
}

