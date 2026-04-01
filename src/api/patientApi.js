import { apiFetch } from "./http.js";

export async function getMyAppointments() {
  return await apiFetch("/appointments/patient", { method: "GET" });
}

export async function browseDoctors(params = {}) {
  const qs = new URLSearchParams({
    search: params.search ?? "",
    specialization: params.specialization ?? "",
    day: params.day ?? "",
    minRating: params.minRating ?? "",
    minExperience: params.minExperience ?? "",
  });
  return await apiFetch(`/patients/browse?${qs.toString()}`, { method: "GET" });
}

