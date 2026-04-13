import { apiFetch } from "./http.js";

export async function getMe() {
  return await apiFetch("/users/me", { method: "GET" });
}

export async function updateTimezone(timezone) {
  return await apiFetch("/users/timezone", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ timezone }),
  });
}

/** PATCH /api/v1/users/update-profile-picture — multipart field "profilePhoto" (multer.fields). */
export async function updateProfilePhoto(file) {
  const fd = new FormData();
  fd.append("profilePhoto", file);
  return await apiFetch("/users/update-profile-picture", {
    method: "PATCH",
    body: fd,
  });
}

/** PATCH /api/v1/users/change-password — body { oldPassword, newPassword }. */
export async function changePassword({ oldPassword, newPassword }) {
  return await apiFetch("/users/change-password", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ oldPassword, newPassword }),
  });
}

