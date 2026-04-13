import { apiFetch } from "./http.js";

export async function getNotifications({ unreadOnly = false, limit = 50 } = {}) {
  const qs = new URLSearchParams();
  if (unreadOnly) qs.set("unreadOnly", "true");
  if (limit != null) qs.set("limit", String(limit));
  const q = qs.toString();
  return await apiFetch(`/notifications${q ? `?${q}` : ""}`, { method: "GET" });
}

export async function markNotificationRead(notificationId) {
  const id = encodeURIComponent(String(notificationId));
  return await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead() {
  return await apiFetch("/notifications/read-all", { method: "PATCH" });
}
