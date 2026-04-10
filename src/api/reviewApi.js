import { apiFetch } from "./http.js";

export async function createReview(appointmentId, { rating, comment }) {
  return await apiFetch(`/reviews/${appointmentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating, comment }),
  });
}

export async function getDoctorReviews(doctorId) {
  return await apiFetch(`/reviews/doctor/${doctorId}`, { method: "GET" });
}

