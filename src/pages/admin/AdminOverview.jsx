import { useEffect, useState } from "react";
import * as adminApi from "../../api/adminApi.js";
import { pickEntity } from "../../api/apiResponse.js";

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-extrabold text-slate-900">{value}</p>
    </div>
  );
}

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setStatus("loading");
      setError(null);
      try {
        const res = await adminApi.getDashboardKpis();
        const entity = pickEntity(res) ?? res?.data ?? null;
        if (mounted) setData(entity);
        if (mounted) setStatus("ok");
      } catch (e) {
        if (mounted) {
          setError(e?.data?.message ?? e?.message ?? "Could not load dashboard");
          setStatus("error");
        }
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const top = Array.isArray(data?.topRatedDoctors) ? data.topRatedDoctors : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          Overview metrics (FR-009 / FR-012).
        </p>
      </div>

      {status === "error" ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={status === "ok" ? data?.totalUsers ?? "—" : "…"} />
        <StatCard label="Patients" value={status === "ok" ? data?.totalPatients ?? "—" : "…"} />
        <StatCard label="Doctors" value={status === "ok" ? data?.totalDoctors ?? "—" : "…"} />
        <StatCard
          label="Appointments"
          value={status === "ok" ? data?.totalAppointments ?? "—" : "…"}
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
        <h2 className="text-sm font-extrabold text-slate-900">Top-rated doctors</h2>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          Approved doctors by average rating (backend ordering).
        </p>
        {status === "loading" ? (
          <p className="mt-4 text-sm text-slate-600">Loading…</p>
        ) : null}
        {status === "ok" && top.length === 0 ? (
          <p className="mt-4 text-sm font-semibold text-slate-600">No data yet.</p>
        ) : null}
        <ul className="mt-4 divide-y divide-slate-100">
          {top.map((d) => {
            const id = d?._id ?? d?.id;
            const name =
              typeof d?.userId === "object" && d.userId?.name
                ? d.userId.name
                : "Doctor";
            return (
              <li key={id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                <span className="font-extrabold text-slate-900">{name}</span>
                <span className="font-semibold text-slate-600">
                  ★ {d?.averageRating ?? "—"} · {d?.totalReviews ?? 0} reviews
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
