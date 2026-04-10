import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as appointmentApi from "../../api/appointmentApi.js";
import { useAppSelector } from "../../store/hooks.js";
import { formatAppointmentWhen } from "../../utils/appointmentTime.js";

function Badge({ status }) {
  const s = String(status || "pending").toLowerCase();
  const cls =
    s === "confirmed"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : s === "pending"
        ? "bg-amber-50 text-amber-800 ring-amber-200"
        : s === "rejected"
          ? "bg-red-50 text-red-700 ring-red-200"
          : s === "cancelled"
            ? "bg-slate-100 text-slate-700 ring-slate-200"
            : s === "completed"
              ? "bg-blue-50 text-blue-700 ring-blue-200"
              : "bg-slate-100 text-slate-700 ring-slate-200";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-extrabold ring-1",
        cls,
      ].join(" ")}
    >
      {s}
    </span>
  );
}

function whenText(a, viewerTz) {
  if (a?.startAt) {
    return formatAppointmentWhen(a.startAt, viewerTz);
  }
  if (a?.date && a?.startTime) return `${a.date} ${a.startTime}`;
  return "—";
}

function doctorNameFromAppointment(a) {
  // backend: populated doctorId -> userId
  const d = a?.doctorId;
  if (typeof d === "object") {
    if (typeof d?.userId === "object" && d.userId?.name) return d.userId.name;
    if (d?.name) return d.name;
  }
  return "—";
}

export default function PatientAppointments() {
  const { user } = useAppSelector((s) => s.auth);
  const viewerTz =
    user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("upcoming"); // upcoming | completed | cancelled | all
  const [actionId, setActionId] = useState(null);
  const [actionError, setActionError] = useState(null);

  async function load() {
    setStatus("loading");
    setError(null);
    try {
      const res = await appointmentApi.getPatientAppointments();
      const list = Array.isArray(res?.data) ? res.data : [];
      setItems(list);
      setStatus("ok");
    } catch (e) {
      setError(e?.message ?? "Could not load appointments");
      setItems([]);
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const now = Date.now();
    if (tab === "all") return items;
    if (tab === "cancelled")
      return items.filter((a) => String(a?.status).toLowerCase() === "cancelled");
    if (tab === "completed")
      return items.filter((a) => String(a?.status).toLowerCase() === "completed");
    // upcoming: pending/confirmed + future (if startAt available)
    return items.filter((a) => {
      const s = String(a?.status || "").toLowerCase();
      if (!["pending", "confirmed"].includes(s)) return false;
      if (!a?.startAt) return true;
      const t = new Date(a.startAt).getTime();
      if (Number.isNaN(t)) return true;
      return t >= now;
    });
  }, [items, tab]);

  async function cancel(appointmentId) {
    setActionId(appointmentId);
    setActionError(null);
    try {
      await appointmentApi.updateAppointmentStatus(appointmentId, "cancelled");
      await load();
    } catch (e) {
      setActionError(e?.data?.message ?? e?.message ?? "Cancel failed");
    } finally {
      setActionId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">
            My appointments
          </h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Times shown in your timezone:{" "}
            <span className="font-mono font-extrabold text-slate-800">
              {viewerTz ?? "browser default"}
            </span>
            .
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { id: "upcoming", label: "Upcoming" },
          { id: "completed", label: "Completed" },
          { id: "cancelled", label: "Cancelled" },
          { id: "all", label: "All" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={[
              "h-10 rounded-xl px-4 text-sm font-extrabold",
              tab === t.id
                ? "bg-[#007E85] text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {status === "loading" ? (
        <p className="text-sm font-semibold text-slate-600">Loading…</p>
      ) : null}

      {status === "error" ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </div>
      ) : null}

      {actionError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {actionError}
        </div>
      ) : null}

      {status === "ok" && filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm font-semibold text-slate-600">
          No appointments found for this tab.
        </div>
      ) : null}

      {status === "ok" && filtered.length ? (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">Doctor</th>
                <th className="px-6 py-3">When</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((a) => {
                const id = a?._id ?? a?.id;
                const st = String(a?.status || "").toLowerCase();
                const canCancel = st === "pending" || st === "confirmed";
                const busy = actionId === id;
                const canReview = st === "completed";
                return (
                  <tr key={id} className="text-sm">
                    <td className="px-6 py-4 font-extrabold text-slate-900">
                      {doctorNameFromAppointment(a)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700">
                      {whenText(a, viewerTz)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={a.status} />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {canReview ? (
                          <Link
                            to={`/patient/reviews?appointmentId=${encodeURIComponent(
                              id,
                            )}`}
                            className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
                          >
                            Review
                          </Link>
                        ) : null}

                        {canCancel ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => cancel(id)}
                            className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                          >
                            Cancel
                          </button>
                        ) : null}

                        {!canReview && !canCancel ? (
                          <span className="text-xs font-semibold text-slate-400">
                            —
                          </span>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      <p className="text-xs font-semibold text-slate-500">
        Backend: <span className="font-mono">GET /appointments/patient</span> and{" "}
        <span className="font-mono">PATCH /appointments/:id/status</span>.{" "}
        Cancellation rules are enforced by backend (pending anytime, confirmed ≥
        24h before).
      </p>
    </div>
  );
}

