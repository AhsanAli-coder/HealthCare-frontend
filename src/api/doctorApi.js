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

/** PATCH /doctors/update-profile — specialization, experience, consultationFee, bio (send only fields to change). */
export async function updateDoctorProfile(body) {
  return await apiFetch("/doctors/update-profile", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

