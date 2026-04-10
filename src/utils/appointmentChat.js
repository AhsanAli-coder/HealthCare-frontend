/** Backend allows chat for confirmed or completed appointments. */
export function appointmentAllowsChatStatus(status) {
  const s = String(status || "").toLowerCase();
  return s === "confirmed" || s === "completed";
}

/** FR-005: chat ends 1 hour after appointment start (matches backend socket rule). */
export function isChatWindowOpen(startAt) {
  if (!startAt) return true;
  const t = new Date(startAt).getTime();
  if (Number.isNaN(t)) return true;
  return Date.now() <= t + 60 * 60 * 1000;
}

export function chatEligibleAppointment(a) {
  return (
    appointmentAllowsChatStatus(a?.status) && isChatWindowOpen(a?.startAt)
  );
}
