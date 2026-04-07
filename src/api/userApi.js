import { apiFetch } from "./http.js";

export async function updateTimezone(timezone) {
  return await apiFetch("/users/timezone", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ timezone }),
  });
}

