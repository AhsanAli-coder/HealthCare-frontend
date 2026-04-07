import { useEffect, useMemo, useState } from "react";
import DoctorTopbar from "../../components/doctor/layout/DoctorTopbar.jsx";
import * as doctorApi from "../../api/doctorApi.js";

const DAYS = [
  { value: "mon", label: "Monday" },
  { value: "tue", label: "Tuesday" },
  { value: "wed", label: "Wednesday" },
  { value: "thu", label: "Thursday" },
  { value: "fri", label: "Friday" },
  { value: "sat", label: "Saturday" },
  { value: "sun", label: "Sunday" },
];

function normalizeDay(value) {
  const v = String(value || "").trim().toLowerCase();
  if (!v) return "mon";
  if (v.length >= 3) return v.slice(0, 3);
  return v;
}

function isValidHHmm(t) {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(String(t || ""));
}

function Row({ row, onChange, onRemove }) {
  return (
    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_140px_140px_44px] sm:items-end">
      <label className="block">
        <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
          Day
        </span>
        <select
          value={row.day}
          onChange={(e) => onChange({ ...row, day: e.target.value })}
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
        >
          {DAYS.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
          Start
        </span>
        <input
          type="time"
          value={row.startTime}
          onChange={(e) => onChange({ ...row, startTime: e.target.value })}
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
        />
      </label>

      <label className="block">
        <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
          End
        </span>
        <input
          type="time"
          value={row.endTime}
          onChange={(e) => onChange({ ...row, endTime: e.target.value })}
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
        />
      </label>

      <button
        type="button"
        onClick={onRemove}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
        aria-label="Remove"
        title="Remove"
      >
        ×
      </button>
    </div>
  );
}

export default function DoctorScheduleTimings() {
  const [rows, setRows] = useState([
    { day: "mon", startTime: "10:00", endTime: "14:00" },
  ]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [saveMessage, setSaveMessage] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setStatus("loading");
      setError(null);
      try {
        const res = await doctorApi.getMe();
        const doc = res?.data ?? null;
        const avail = Array.isArray(doc?.availability) ? doc.availability : [];
        const normalized = avail.map((a) => ({
          day: normalizeDay(a.day),
          startTime: a.startTime ?? "10:00",
          endTime: a.endTime ?? "14:00",
        }));
        if (mounted) {
          setRows(normalized.length ? normalized : rows);
          setStatus("ok");
        }
      } catch (e) {
        if (mounted) {
          setError(e?.message ?? "Could not load profile");
          setStatus("error");
        }
      }
    }
    run();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validation = useMemo(() => {
    const issues = [];
    if (!rows.length) issues.push("Add at least one availability rule.");
    rows.forEach((r, idx) => {
      if (!r.day) issues.push(`Row ${idx + 1}: day is required.`);
      if (!isValidHHmm(r.startTime))
        issues.push(`Row ${idx + 1}: start time must be HH:mm.`);
      if (!isValidHHmm(r.endTime))
        issues.push(`Row ${idx + 1}: end time must be HH:mm.`);
      if (isValidHHmm(r.startTime) && isValidHHmm(r.endTime)) {
        if (r.endTime <= r.startTime) {
          issues.push(`Row ${idx + 1}: end time must be after start time.`);
        }
      }
    });
    return { ok: issues.length === 0, issues };
  }, [rows]);

  async function onSave() {
    setSaveStatus("loading");
    setSaveMessage(null);
    try {
      const payload = rows.map((r) => ({
        day: r.day,
        startTime: r.startTime,
        endTime: r.endTime,
      }));
      const res = await doctorApi.updateAvailability(payload);
      setSaveStatus("ok");
      setSaveMessage(res?.message ?? "Availability updated successfully");
    } catch (e) {
      setSaveStatus("error");
      setSaveMessage(e?.data?.message ?? e?.message ?? "Could not save");
    }
  }

  return (
    <>
      <DoctorTopbar title="Schedule Timings" subtitle="Set your availability" />

      <div className="mx-auto max-w-[1200px] px-6 py-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
          <h1 className="text-lg font-extrabold text-slate-900">
            Weekly availability
          </h1>
          <p className="mt-2 text-sm font-semibold text-slate-600">
            Patients will see slots based on these rules. Times are interpreted
            in the patient’s timezone when generating slots.
          </p>

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

          <div className="mt-6 space-y-3">
            {rows.map((r, idx) => (
              <Row
                key={`${r.day}-${idx}`}
                row={r}
                onChange={(next) =>
                  setRows((prev) => prev.map((x, i) => (i === idx ? next : x)))
                }
                onRemove={() =>
                  setRows((prev) => prev.filter((_, i) => i !== idx))
                }
              />
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
              onClick={() =>
                setRows((prev) => [
                  ...prev,
                  { day: "mon", startTime: "10:00", endTime: "14:00" },
                ])
              }
            >
              + Add rule
            </button>

            <button
              type="button"
              disabled={!validation.ok || saveStatus === "loading"}
              className="h-11 rounded-xl bg-[#007E85] px-5 text-sm font-extrabold text-white shadow-sm hover:bg-[#006970] disabled:opacity-60"
              onClick={onSave}
            >
              {saveStatus === "loading" ? "Saving…" : "Save availability"}
            </button>
          </div>

          {!validation.ok ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-900">
              <p className="font-extrabold">Fix these before saving:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {validation.issues.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {saveStatus === "ok" && saveMessage ? (
            <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-semibold text-emerald-900">
              {saveMessage}
            </div>
          ) : null}

          {saveStatus === "error" && saveMessage ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-semibold text-red-800">
              {saveMessage}
            </div>
          ) : null}

          <p className="mt-6 text-xs font-semibold text-slate-500">
            Backend: <span className="font-mono">PATCH /doctors/availability</span>{" "}
            with <span className="font-mono">{"{ availability: [{day,startTime,endTime}] }"}</span>
            .
          </p>
        </div>
      </div>
    </>
  );
}

