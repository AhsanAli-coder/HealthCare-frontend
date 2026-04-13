import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as notificationApi from "../../api/notificationApi.js";
import { useDashboardNotifications } from "../../context/DashboardNotificationContext.jsx";

function typeLabel(type) {
  const t = String(type || "").toLowerCase();
  if (t === "appointment_update") return "Appointment";
  if (t === "new_message") return "Message";
  if (t === "system_alert") return "System";
  return t || "Notice";
}

export default function PatientNotifications() {
  const { refreshUnread } = useDashboardNotifications();
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState(null);

  async function load() {
    setStatus("loading");
    setError(null);
    try {
      const res = await notificationApi.getNotifications({
        unreadOnly: false,
        limit: 100,
      });
      const list = Array.isArray(res?.data) ? res.data : [];
      setItems(list);
      setStatus("ok");
    } catch (e) {
      setError(e?.data?.message ?? e?.message ?? "Could not load notifications");
      setItems([]);
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function markOne(id) {
    setBusyId(id);
    setMsg(null);
    try {
      await notificationApi.markNotificationRead(id);
      await load();
      await refreshUnread();
    } catch (e) {
      setMsg(e?.data?.message ?? e?.message ?? "Could not update");
    } finally {
      setBusyId(null);
    }
  }

  async function markAll() {
    setBusyId("all");
    setMsg(null);
    try {
      await notificationApi.markAllNotificationsRead();
      await load();
      await refreshUnread();
      setMsg("All marked as read.");
    } catch (e) {
      setMsg(e?.data?.message ?? e?.message ?? "Could not update");
    } finally {
      setBusyId(null);
    }
  }

  const apptLink = (relatedId) =>
    relatedId
      ? `/patient/messages?appointmentId=${encodeURIComponent(String(relatedId))}`
      : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Notifications</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            In-app alerts for appointments and messages (FR-007). Email is sent
            from the server when your team configures it—we do not send SMS from
            this app.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={load}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
          >
            Refresh
          </button>
          {items.some((n) => !n.isRead) ? (
            <button
              type="button"
              disabled={busyId === "all"}
              onClick={markAll}
              className="h-10 rounded-xl bg-[#007E85] px-4 text-sm font-extrabold text-white hover:bg-[#006970] disabled:opacity-60"
            >
              Mark all read
            </button>
          ) : null}
        </div>
      </div>

      {msg ? (
        <p className="text-sm font-semibold text-slate-700">{msg}</p>
      ) : null}

      {status === "error" ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </div>
      ) : null}

      <div className="space-y-3">
        {status === "loading" ? (
          <p className="text-sm font-semibold text-slate-600">Loading…</p>
        ) : null}
        {status === "ok" && items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm font-semibold text-slate-600">
            No notifications yet.
          </div>
        ) : null}
        {items.map((n) => {
          const id = n?._id ?? n?.id;
          const unread = !n.isRead;
          const rel = n?.relatedAppointmentId;
          const relId =
            rel && typeof rel === "object" ? rel._id ?? rel.id : rel;
          const chatTo = apptLink(relId);
          return (
            <div
              key={id}
              className={[
                "rounded-2xl border px-5 py-4 shadow-sm",
                unread
                  ? "border-[#007E85]/40 bg-sky-50/60"
                  : "border-slate-200 bg-white",
              ].join(" ")}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-slate-600">
                    {typeLabel(n.type)}
                  </span>
                  <p className="mt-2 text-sm font-semibold text-slate-900">
                    {n.message}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                  {unread ? (
                    <button
                      type="button"
                      disabled={busyId === id}
                      onClick={() => markOne(id)}
                      className="text-xs font-extrabold text-[#007E85] hover:underline disabled:opacity-50"
                    >
                      Mark read
                    </button>
                  ) : null}
                  {chatTo && n.type === "new_message" ? (
                    <Link
                      to={chatTo}
                      className="text-xs font-extrabold text-slate-700 hover:underline"
                    >
                      Open chat
                    </Link>
                  ) : null}
                  {relId && n.type === "appointment_update" ? (
                    <Link
                      to="/patient/appointments"
                      className="text-xs font-extrabold text-slate-700 hover:underline"
                    >
                      Appointments
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
