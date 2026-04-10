export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "/api/v1";

/**
 * Socket.IO connects here (path /socket.io). In Vite dev, proxy /socket.io → backend.
 * Override with VITE_SOCKET_ORIGIN (e.g. http://localhost:9000) if needed.
 */
export function getSocketOrigin() {
  const explicit = import.meta.env.VITE_SOCKET_ORIGIN?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

