import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../store/hooks.js";
import * as adminApi from "../../api/adminApi.js";

export default function AdminUsers() {
  const meId = useAppSelector((s) => s.auth.user?._id ?? s.auth.user?.id);
  const [roleFilter, setRoleFilter] = useState("");
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await adminApi.listUsers({
        role: roleFilter === "patient" || roleFilter === "doctor" ? roleFilter : undefined,
      });
      const list = Array.isArray(res?.data) ? res.data : [];
      setItems(list);
      setStatus("ok");
    } catch (e) {
      setError(e?.data?.message ?? e?.message ?? "Could not load users");
      setItems([]);
      setStatus("error");
    }
  }, [roleFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function suspend(userId) {
    if (String(userId) === String(meId)) {
      setMsg("You cannot suspend your own admin account from this list.");
      return;
    }
    setBusyId(userId);
    setMsg(null);
    try {
      await adminApi.suspendUser(userId);
      setMsg("User suspended.");
      await load();
    } catch (e) {
      setMsg(e?.data?.message ?? e?.message ?? "Failed");
    } finally {
      setBusyId(null);
    }
  }

  async function activate(userId) {
    setBusyId(userId);
    setMsg(null);
    try {
      await adminApi.activateUser(userId);
      setMsg("User activated.");
      await load();
    } catch (e) {
      setMsg(e?.data?.message ?? e?.message ?? "Failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Users</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Suspend or activate patients and doctors (FR-009).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold"
          >
            <option value="">All roles</option>
            <option value="patient">Patients</option>
            <option value="doctor">Doctors</option>
          </select>
          <button
            type="button"
            onClick={load}
            className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>
      </div>

      {msg ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-800">
          {msg}
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {status === "loading" ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-600">
                  Loading…
                </td>
              </tr>
            ) : null}
            {status === "ok" && items.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center font-semibold text-slate-600">
                  No users.
                </td>
              </tr>
            ) : null}
            {items.map((u) => {
              const id = u?._id ?? u?.id;
              const st = String(u?.status || "active").toLowerCase();
              const busy = busyId === id;
              const isSelf = String(id) === String(meId);
              return (
                <tr key={id}>
                  <td className="px-4 py-3 font-extrabold text-slate-900">{u?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600">{u?.email ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold capitalize text-slate-700">
                    {u?.role ?? "—"}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-600">{st}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {st !== "suspended" ? (
                        <button
                          type="button"
                          disabled={busy || isSelf}
                          onClick={() => suspend(id)}
                          className="h-8 rounded-lg border border-red-200 bg-red-50 px-3 text-xs font-extrabold text-red-800 hover:bg-red-100 disabled:opacity-50"
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => activate(id)}
                          className="h-8 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-xs font-extrabold text-emerald-900 hover:bg-emerald-100 disabled:opacity-50"
                        >
                          Activate
                        </button>
                      )}
                    </div>
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
