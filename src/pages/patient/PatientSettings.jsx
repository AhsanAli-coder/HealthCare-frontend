import { useMemo, useState } from "react";
import * as userApi from "../../api/userApi.js";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";
import { setCredentials } from "../../store/slices/authSlice.js";

const COMMON_TIMEZONES = [
  "Asia/Karachi",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Europe/London",
  "Europe/Berlin",
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "UTC",
];

export default function PatientSettings() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  const browserTz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    [],
  );

  const initial = user?.timezone || browserTz;
  const [timezone, setTimezone] = useState(initial);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  async function onSave() {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await userApi.updateTimezone(timezone);
      const updatedUser = res?.data ?? null;

      // Keep redux in sync so slots use the saved timezone.
      dispatch(
        setCredentials({
          user: updatedUser ?? { ...(user ?? {}), timezone },
          role: updatedUser?.role ?? user?.role,
        }),
      );

      setStatus("ok");
      setMessage(res?.message ?? "Timezone updated");
    } catch (e) {
      setStatus("error");
      setMessage(e?.data?.message ?? e?.message ?? "Could not update timezone");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          Your timezone is used for showing appointment slots.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-extrabold text-slate-900">
          Preferred timezone
        </h2>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          Browser detected: <span className="font-mono">{browserTz}</span>
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Timezone
            </span>
            <input
              list="tz-list"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              placeholder="e.g. Asia/Karachi"
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            />
            <datalist id="tz-list">
              {COMMON_TIMEZONES.map((tz) => (
                <option key={tz} value={tz} />
              ))}
            </datalist>
          </label>

          <button
            type="button"
            onClick={onSave}
            disabled={status === "loading" || !timezone?.trim()}
            className="h-11 rounded-xl bg-[#007E85] px-5 text-sm font-extrabold text-white shadow-sm hover:bg-[#006970] disabled:opacity-60"
          >
            {status === "loading" ? "Saving…" : "Save"}
          </button>
        </div>

        {status === "ok" && message ? (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
            {message}
          </div>
        ) : null}

        {status === "error" && message ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {message}
          </div>
        ) : null}
      </div>
    </div>
  );
}

