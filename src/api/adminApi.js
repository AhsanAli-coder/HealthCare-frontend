import { apiFetch } from "./http.js";

export async function getDashboardKpis() {
  return await apiFetch("/admin/dashboard/kpis", { method: "GET" });
}

export async function getPendingDoctors() {
  return await apiFetch("/admin/doctors/pending", { method: "GET" });
}

export async function approveDoctor(doctorId) {
  const id = encodeURIComponent(String(doctorId));
  return await apiFetch(`/admin/doctors/${id}/approve`, { method: "PATCH" });
}

export async function listUsers({ role } = {}) {
  const qs = new URLSearchParams();
  if (role === "patient" || role === "doctor") qs.set("role", role);
  const q = qs.toString();
  return await apiFetch(`/admin/users${q ? `?${q}` : ""}`, { method: "GET" });
}

export async function suspendUser(userId) {
  const id = encodeURIComponent(String(userId));
  return await apiFetch(`/admin/users/${id}/suspend`, { method: "PATCH" });
}

export async function activateUser(userId) {
  const id = encodeURIComponent(String(userId));
  return await apiFetch(`/admin/users/${id}/activate`, { method: "PATCH" });
}
