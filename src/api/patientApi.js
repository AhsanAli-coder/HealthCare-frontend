import { apiFetch } from "./http.js";

export async function getMyAppointments() {
  return await apiFetch("/appointments/patient", { method: "GET" });
}

function buildBrowseQuery(params) {
  const qs = new URLSearchParams();
  if (params.search?.trim()) qs.set("search", params.search.trim());
  if (params.specialization?.trim())
    qs.set("specialization", params.specialization.trim());
  if (params.day?.trim()) qs.set("day", params.day.trim());
  if (params.minRating !== "" && params.minRating != null)
    qs.set("minRating", String(params.minRating));
  if (params.minExperience !== "" && params.minExperience != null)
    qs.set("minExperience", String(params.minExperience));
  return qs.toString();
}

export async function browseDoctors(params = {}) {
  const q = buildBrowseQuery(params);
  return await apiFetch(`/patients/browse${q ? `?${q}` : ""}`, {
    method: "GET",
  });
}

export async function getDoctorDetails(doctorId) {
  return await apiFetch(`/patients/doctor/${doctorId}`, { method: "GET" });
}

