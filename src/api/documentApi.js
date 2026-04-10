import { apiFetch } from "./http.js";

export async function getMyDocuments() {
  return await apiFetch("/documents/patient", { method: "GET" });
}

/** Doctor (or staff): list documents uploaded by a specific patient. */
export async function getPatientDocuments(patientId) {
  const id = encodeURIComponent(String(patientId || "").trim());
  return await apiFetch(`/documents/patient/${id}`, { method: "GET" });
}

export async function uploadMyDocument({
  title,
  category,
  description,
  file,
}) {
  const form = new FormData();
  form.append("title", title);
  form.append("category", category);
  if (description) form.append("description", description);
  // Backend expects field name: documentFile
  form.append("documentFile", file);

  return await apiFetch("/documents/upload", {
    method: "POST",
    body: form,
  });
}

/** Doctor: upload a file for a patient (lab report, instructions, etc.). Same route as patient upload with patientId in body. */
export async function uploadDocumentForPatient({
  patientId,
  title,
  category,
  description,
  file,
}) {
  const form = new FormData();
  form.append("patientId", String(patientId));
  form.append("title", title);
  form.append("category", category);
  if (description) form.append("description", description);
  form.append("documentFile", file);

  return await apiFetch("/documents/upload", {
    method: "POST",
    body: form,
  });
}

export async function getDocumentSignedUrl(documentId, { download = false } = {}) {
  const qs = new URLSearchParams();
  if (download) qs.set("download", "true");
  const q = qs.toString();
  return await apiFetch(`/documents/${documentId}/signed-url${q ? `?${q}` : ""}`, {
    method: "GET",
  });
}