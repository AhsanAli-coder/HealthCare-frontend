import { apiFetch } from "./http.js";
import { pickEntity } from "./apiResponse.js";

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

/** Normalized list from GET /reviews/doctor/:doctorId (ApiResponse wraps array in `data`). */
export async function getDoctorReviewsList(doctorId) {
  if (!doctorId) return [];
  const res = await getDoctorReviews(doctorId);
  const data = pickEntity(res);
  return Array.isArray(data) ? data : [];
}

export function formatReviewDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

/** Map API review document to UI card fields. */
export function mapReviewToCardItem(review) {
  const patient = review?.patientId;
  const name =
    typeof patient === "object" && patient?.name ? patient.name : "Patient";
  const profilePhoto =
    typeof patient === "object" && patient?.profilePhoto
      ? patient.profilePhoto
      : null;
  const rating = Math.min(5, Math.max(1, Number(review?.rating) || 0));
  return {
    id: String(review?._id ?? ""),
    name,
    role: "Patient",
    date: formatReviewDate(review?.createdAt),
    stars: rating,
    text: (review?.comment && String(review.comment).trim()) || "—",
    profilePhoto,
  };
}

