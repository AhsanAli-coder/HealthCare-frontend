import { apiFetch } from "./http.js";

export async function getMe() {
  return await apiFetch("/doctors/me", { method: "GET" });
}

