import { apiFetch } from "./http.js";

export async function getMe() {
  return await apiFetch("/doctors/me", { method: "GET" });
}

export async function updateAvailability(availability) {
  return await apiFetch("/doctors/availability", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ availability }),
  });
}

