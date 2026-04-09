/**
 * Format a stored UTC instant for display in the viewer's preferred IANA timezone.
 * If timeZone is omitted, uses the runtime default (usually browser local).
 */
export function formatAppointmentWhen(value, timeZone) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  const opts = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  if (timeZone && String(timeZone).trim()) {
    opts.timeZone = String(timeZone).trim();
  }
  return d.toLocaleString(undefined, opts);
}
