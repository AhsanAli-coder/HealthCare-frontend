/** Pull a human-readable message from API error JSON (or ApiError.data). */
export function extractMessageFromResponseBody(data) {
  if (data == null) return null;
  if (typeof data === "string") return data;
  if (typeof data !== "object") return null;
  if (typeof data.message === "string" && data.message.trim()) return data.message;
  if (typeof data.error === "string" && data.error.trim()) return data.error;
  if (typeof data.msg === "string" && data.msg.trim()) return data.msg;
  if (data.data && typeof data.data === "object") {
    if (typeof data.data.message === "string" && data.data.message.trim())
      return data.data.message;
  }
  if (Array.isArray(data.errors) && data.errors[0]) {
    const first = data.errors[0];
    if (typeof first === "string") return first;
    if (typeof first?.msg === "string") return first.msg;
    if (typeof first?.message === "string") return first.message;
  }
  return null;
}

export function extractApiErrorMessage(err) {
  if (!err) return "Something went wrong";
  const fromBody = extractMessageFromResponseBody(err.data);
  if (fromBody) return fromBody;
  if (typeof err.message === "string" && err.message.trim()) return err.message;
  return "Request failed";
}

/**
 * Normalize common API envelopes from the backend.
 * Supports: { data: { url } }, { data: { data: { url } } }, or { url }.
 */
export function pickSignedUrl(payload) {
  if (!payload || typeof payload !== "object") return null;
  const inner = payload.data;
  if (
    inner &&
    typeof inner === "object" &&
    typeof inner.url === "string" &&
    inner.url.length > 0
  ) {
    return inner.url;
  }
  if (
    inner &&
    typeof inner === "object" &&
    inner.data &&
    typeof inner.data.url === "string" &&
    inner.data.url.length > 0
  ) {
    return inner.data.url;
  }
  if (typeof payload.url === "string" && payload.url.length > 0) {
    return payload.url;
  }
  return null;
}

/**
 * Single resource: { data: T } or { data: { data: T } }.
 * Arrays are returned as-is (list endpoints).
 */
export function pickEntity(payload) {
  if (!payload?.data) return null;
  const d = payload.data;
  if (Array.isArray(d)) return d;
  if (
    d &&
    typeof d === "object" &&
    d.data != null &&
    typeof d.data === "object" &&
    !Array.isArray(d.data)
  ) {
    return d.data;
  }
  return d;
}

/**
 * Prescription GET: entity may be the record itself or wrapped as { prescription }.
 */
export function pickPrescriptionRecord(res) {
  const entity = pickEntity(res) ?? res?.data ?? null;
  if (!entity || Array.isArray(entity)) return null;
  if (
    entity.prescription &&
    typeof entity.prescription === "object" &&
    !Array.isArray(entity.prescription)
  ) {
    return entity.prescription;
  }
  return entity;
}
