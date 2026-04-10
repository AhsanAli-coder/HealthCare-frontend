import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DoctorTopbar from "../../components/doctor/layout/DoctorTopbar.jsx";
import * as appointmentApi from "../../api/appointmentApi.js";
import { useAppSelector } from "../../store/hooks.js";
import { formatAppointmentWhen } from "../../utils/appointmentTime.js";
import { chatEligibleAppointment } from "../../utils/appointmentChat.js";

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
              : s === "no_show"
                ? "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200"
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

function fmtWhen(a, viewerTz) {
  if (a?.startAt) {
    return formatAppointmentWhen(a.startAt, viewerTz);
  }
  if (a?.date && a?.startTime) return `${a.date} ${a.startTime}`;
  return "—";
}

export default function DoctorAppointments() {
  const { user } = useAppSelector((s) => s.auth);
  const viewerTz =
    user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("pending"); // pending | confirmed | all
  const [actionId, setActionId] = useState(null);
  const [actionError, setActionError] = useState(null);

  async function load() {
    setStatus("loading");
    setError(null);
    try {
      const res = await appointmentApi.getDoctorAppointments();
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
    if (tab === "all") return items;
    return items.filter((a) => String(a?.status || "").toLowerCase() === tab);
  }, [items, tab]);

  async function act(appointmentId, nextStatus) {
    setActionId(appointmentId);
    setActionError(null);
    try {
      await appointmentApi.updateAppointmentStatus(appointmentId, nextStatus);
      await load();
    } catch (e) {
      setActionError(e?.data?.message ?? e?.message ?? "Action failed");
    } finally {
      setActionId(null);
    }
  }

  return (
    <>
      <DoctorTopbar title="Appointments" subtitle="Manage booking requests" />

      <div className="mx-auto max-w-[1200px] px-6 py-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-lg font-extrabold text-slate-900">
                Appointment requests
              </h1>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                Times in your timezone:{" "}
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

          <div className="mt-5 flex flex-wrap gap-2">
            {[
              { id: "pending", label: "Pending" },
              { id: "confirmed", label: "Confirmed" },
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
            <p className="mt-6 text-sm font-semibold text-slate-600">
              Loading…
            </p>
          ) : null}

          {status === "error" ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              {error}
            </div>
          ) : null}

          {actionError ? (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              {actionError}
            </div>
          ) : null}

          {status === "ok" && filtered.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm font-semibold text-slate-600">
              No appointments in this tab.
            </div>
          ) : null}

          {status === "ok" && filtered.length ? (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                    <th className="px-3 py-3">Patient</th>
                    <th className="px-3 py-3">When</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((a) => {
                    const patient = a?.patientId;
                    const patientName =
                      typeof patient === "object" && patient?.name
                        ? patient.name
                        : "—";
                    const id = a?._id ?? a?.id;
                    const st = String(a?.status || "").toLowerCase();
                    const isBusy = actionId === id;
                    const canChat = chatEligibleAppointment(a);
                    return (
                      <tr key={id} className="text-sm">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-3">
                            <span
                              className="h-10 w-10 rounded-full bg-slate-200"
                              aria-hidden
                            />
                            <div className="min-w-0">
                              <div className="truncate font-extrabold text-slate-900">
                                {patientName}
                              </div>
                              {typeof patient === "object" && patient?.phone ? (
                                <div className="text-xs font-semibold text-slate-500">
                                  {patient.phone}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-semibold text-slate-700">
                          {fmtWhen(a, viewerTz)}
                        </td>
                        <td className="px-3 py-3">
                          <Badge status={a.status} />
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap justify-end gap-2">
                            {(() => {
                              const pid =
                                typeof patient === "object" && patient
                                  ? patient._id ?? patient.id
                                  : typeof patient === "string"
                                    ? patient
                                    : "";
                              return pid ? (
                                <Link
                                  to={`/doctor/patients?patientId=${encodeURIComponent(pid)}`}
                                  className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
                                >
                                  Patient files
                                </Link>
                              ) : null;
                            })()}
                            {st === "pending" ? (
                              <>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => act(id, "rejected")}
                                  className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                                >
                                  Reject
                                </button>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => act(id, "confirmed")}
                                  className="h-9 rounded-xl bg-[#007E85] px-3 text-xs font-extrabold text-white hover:bg-[#006970] disabled:opacity-60"
                                >
                                  Confirm
                                </button>
                              </>
                            ) : st === "confirmed" ? (
                              <>
                                <Link
                                  to={`/doctor/prescriptions?appointmentId=${encodeURIComponent(id)}`}
                                  className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-slate-700 hover:bg-slate-50"
                                >
                                  Prescription
                                </Link>
                                <button
                                  type="button"
                                  disabled={isBusy}
                                  onClick={() => act(id, "completed")}
                                  className="h-9 rounded-xl bg-[#007E85] px-3 text-xs font-extrabold text-white hover:bg-[#006970] disabled:opacity-60"
                                >
                                  Complete
                                </button>
                              </>
                            ) : null}
                            {canChat ? (
                              <Link
                                to={`/doctor/messages?appointmentId=${encodeURIComponent(id)}`}
                                className="inline-flex h-9 items-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-extrabold text-[#007E85] hover:bg-slate-50"
                              >
                                Chat
                              </Link>
                            ) : null}
                            {st !== "pending" &&
                            st !== "confirmed" &&
                            !canChat ? (
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

          <p className="mt-6 text-xs font-semibold text-slate-500">
            Backend: <span className="font-mono">GET /appointments/doctor</span>{" "}
            and <span className="font-mono">PATCH /appointments/:id/status</span>.
          </p>
        </div>
      </div>
    </>
  );
}

