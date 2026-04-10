import { apiFetch } from "./http.js";

export async function getChatHistory(appointmentId) {
  const id = encodeURIComponent(String(appointmentId || "").trim());
  return await apiFetch(`/messages/${id}`, { method: "GET" });
}
