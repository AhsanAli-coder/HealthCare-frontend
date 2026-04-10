import { apiFetch } from "./http.js";

export async function getPrescription(appointmentId) {
  return await apiFetch(`/prescriptions/${appointmentId}`, { method: "GET" });
}

export async function createPrescription(appointmentId, body) {
  return await apiFetch(`/prescriptions/${appointmentId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

/** When Cloudinary raw PDF is private (401 on direct pdfUrl), backend exposes this mirror of document signed-url. */
export async function getPrescriptionSignedPdfUrl(
  appointmentId,
  { download = true } = {},
) {
  const qs = new URLSearchParams();
  if (download) qs.set("download", "true");
  const q = qs.toString();
  return await apiFetch(
    `/prescriptions/${appointmentId}/signed-pdf-url${q ? `?${q}` : ""}`,
    { method: "GET" },
  );
}

