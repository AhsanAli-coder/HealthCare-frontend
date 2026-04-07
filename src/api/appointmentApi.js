import { apiFetch } from "./http.js";

export async function getDoctorAppointments() {
  return await apiFetch("/appointments/doctor", { method: "GET" });
}

export async function getPatientAppointments() {
  return await apiFetch("/appointments/patient", { method: "GET" });
}

export async function updateAppointmentStatus(appointmentId, status) {
  return await apiFetch(`/appointments/${appointmentId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

