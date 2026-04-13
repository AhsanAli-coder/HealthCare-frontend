import { useCallback, useEffect, useState } from "react";
import * as adminApi from "../../api/adminApi.js";

export default function AdminPendingDoctors() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await adminApi.getPendingDoctors();
      const list = Array.isArray(res?.data) ? res.data : [];
      setItems(list);
      setStatus("ok");
    } catch (e) {
      setError(e?.data?.message ?? e?.message ?? "Could not load");
      setItems([]);
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function approve(doctorId) {
    setBusyId(doctorId);
    setActionMsg(null);
    try {
      await adminApi.approveDoctor(doctorId);
      setActionMsg("Doctor approved.");
      await load();
    } catch (e) {
      setActionMsg(e?.data?.message ?? e?.message ?? "Approve failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Pending doctors</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Approve new doctor registrations (FR-002 / FR-009).
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      {actionMsg ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800">
          {actionMsg}
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </div>
      ) : null}

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-xs font-extrabold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Doctor profile</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {status === "loading" ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-slate-600">
                  Loading…
                </td>
              </tr>
            ) : null}
            {status === "ok" && items.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center font-semibold text-slate-600">
                  No pending doctors.
                </td>
              </tr>
            ) : null}
            {items.map((doc) => {
              const did = doc?._id ?? doc?.id;
              const u = doc?.userId;
              const name = typeof u === "object" && u?.name ? u.name : "—";
              const email = typeof u === "object" && u?.email ? u.email : "—";
              const busy = busyId === did;
              return (
                <tr key={did}>
                  <td className="px-4 py-3 font-mono text-xs text-slate-600">
                    {String(did)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-extrabold text-slate-900">{name}</div>
                    <div className="text-xs font-semibold text-slate-500">{email}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => approve(did)}
                      className="h-9 rounded-xl bg-[#007E85] px-4 text-xs font-extrabold text-white hover:bg-[#006970] disabled:opacity-60"
                    >
                      {busy ? "…" : "Approve"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
