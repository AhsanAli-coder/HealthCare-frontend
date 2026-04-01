import { useEffect, useMemo, useState } from "react";
import * as patientApi from "../../api/patientApi.js";

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-extrabold text-slate-900">{value}</div>
      {hint ? (
        <div className="mt-2 text-xs font-semibold text-slate-500">{hint}</div>
      ) : null}
    </div>
  );
}

export default function PatientOverview() {
  const [status, setStatus] = useState("idle");
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setStatus("loading");
      try {
        const data = await patientApi.getMyAppointments();
        const items = Array.isArray(data?.appointments)
          ? data.appointments
          : Array.isArray(data)
            ? data
            : [];
        if (mounted) setAppointments(items);
        if (mounted) setStatus("ok");
      } catch {
        if (mounted) setStatus("error");
      }
    }
    run();
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = appointments.length;
    const upcoming = appointments.filter((a) => {
      const raw = a?.date ?? a?.appointmentDate ?? a?.createdAt ?? null;
      const d = raw ? new Date(raw) : null;
      return d && d.getTime() >= Date.now();
    }).length;
    return { total, upcoming };
  }, [appointments]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Upcoming" value={stats.upcoming} hint="Appointments" />
        <StatCard label="Total" value={stats.total} hint="All time" />
        <StatCard label="Messages" value="—" hint="Coming next" />
        <StatCard label="Reviews" value="—" hint="Coming next" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <div className="text-base font-extrabold text-slate-900">
              Recent appointments
            </div>
            <div className="text-xs font-semibold text-slate-500">
              {status === "loading"
                ? "Loading…"
                : status === "error"
                  ? "Could not load appointments."
                  : "Your latest bookings."}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3">Doctor</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {appointments.slice(0, 6).map((a, idx) => (
                <tr key={a?._id ?? a?.id ?? idx} className="text-sm">
                  <td className="px-6 py-3 font-semibold text-slate-800">
                    {a?.doctor?.name ?? a?.doctorName ?? "—"}
                  </td>
                  <td className="px-6 py-3 font-semibold text-slate-700">
                    {a?.date ?? a?.appointmentDate ?? "—"}
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-700">
                      {a?.status ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 ? (
                <tr>
                  <td
                    className="px-6 py-8 text-sm font-semibold text-slate-500"
                    colSpan={3}
                  >
                    No appointments found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

