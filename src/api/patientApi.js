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

export async function getDoctorAvailableSlots(
  doctorId,
  { date, tz, slotMinutes, bufferMinutes } = {},
) {
  const qs = new URLSearchParams();
  if (date) qs.set("date", date);
  if (tz) qs.set("tz", tz);
  if (slotMinutes != null) qs.set("slotMinutes", String(slotMinutes));
  if (bufferMinutes != null) qs.set("bufferMinutes", String(bufferMinutes));
  const q = qs.toString();
  return await apiFetch(
    `/appointments/doctor/${doctorId}/slots${q ? `?${q}` : ""}`,
    { method: "GET" },
  );
}

export async function bookAppointment({
  doctorId,
  date,
  startTime,
  endTime,
  startAt,
  endAt,
}) {
  return await apiFetch("/appointments/book", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      doctorId,
      date,
      startTime,
      endTime,
      startAt,
      endAt,
    }),
  });
}

