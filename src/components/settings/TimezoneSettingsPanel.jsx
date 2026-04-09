import { useEffect, useMemo, useState } from "react";
import * as userApi from "../../api/userApi.js";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";
import { setCredentials } from "../../store/slices/authSlice.js";

const TIMEZONE_GROUPS = [
  {
    label: "Asia",
    options: ["Asia/Karachi", "Asia/Kolkata", "Asia/Dubai", "Asia/Tokyo"],
  },
  {
    label: "Europe",
    options: ["Europe/London", "Europe/Berlin", "Europe/Paris"],
  },
  {
    label: "America",
    options: [
      "America/New_York",
      "America/Chicago",
      "America/Los_Angeles",
      "America/Toronto",
    ],
  },
  {
    label: "Africa",
    options: ["Africa/Cairo", "Africa/Nairobi", "Africa/Johannesburg"],
  },
  {
    label: "Australia",
    options: ["Australia/Sydney", "Australia/Perth"],
  },
];

export default function TimezoneSettingsPanel({ title = "Preferred timezone" }) {
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((s) => s.auth);

  const browserTz = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
    [],
  );

  const initial = user?.timezone || browserTz;
  const [timezone, setTimezone] = useState(initial);

  useEffect(() => {
    setTimezone(user?.timezone || browserTz);
  }, [user?.timezone, browserTz]);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  async function onSave() {
    setStatus("loading");
    setMessage(null);
    try {
      const res = await userApi.updateTimezone(timezone);
      const updatedUser = res?.data ?? null;

      dispatch(
        setCredentials({
          user: updatedUser ?? { ...(user ?? {}), timezone },
          role: updatedUser?.role ?? role ?? user?.role,
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
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-sm font-extrabold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        Appointment times on your dashboard are shown in this timezone. It does
        not change the doctor’s availability rules — when you book, slots are
        generated for <span className="font-extrabold">your</span> local date
        and time.
      </p>
      <p className="mt-2 text-xs font-semibold text-slate-500">
        Browser detected: <span className="font-mono">{browserTz}</span>
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Timezone
          </span>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
          >
            <option value={browserTz}>Browser default ({browserTz})</option>
            <option value="UTC">UTC</option>
            {TIMEZONE_GROUPS.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
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
  );
}
