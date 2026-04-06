import { useCallback, useEffect, useState } from "react";
import * as patientApi from "../../api/patientApi.js";
import DoctorCard from "../../components/patient/DoctorCard.jsx";

const DAYS = [
  { value: "", label: "Any day" },
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

export default function PatientBrowseDoctors() {
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [day, setDay] = useState("");
  const [minRating, setMinRating] = useState("");
  const [minExperience, setMinExperience] = useState("");

  const [doctors, setDoctors] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const res = await patientApi.browseDoctors({
        search,
        specialization,
        day,
        minRating: minRating === "" ? undefined : minRating,
        minExperience: minExperience === "" ? undefined : minExperience,
      });
      const list = Array.isArray(res?.data) ? res.data : [];
      setDoctors(list);
      setStatus("ok");
    } catch (e) {
      setError(e?.message ?? "Could not load doctors");
      setDoctors([]);
      setStatus("error");
    }
  }, [search, specialization, day, minRating, minExperience]);

  useEffect(() => {
    load();
    // Intentionally once on mount; user applies filters with the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Find doctors</h1>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          Search approved doctors by specialization, day, rating, and experience.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="block sm:col-span-2">
            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Matches specialization or bio"
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            />
          </label>
          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Specialization
            </span>
            <input
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder="e.g. Cardiology"
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            />
          </label>
          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Available day
            </span>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            >
              {DAYS.map((d) => (
                <option key={d.value || "any"} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Min rating
            </span>
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              placeholder="0–5"
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            />
          </label>
          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Min experience (years)
            </span>
            <input
              type="number"
              min={0}
              value={minExperience}
              onChange={(e) => setMinExperience(e.target.value)}
              placeholder="e.g. 3"
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            />
          </label>
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={load}
            disabled={status === "loading"}
            className="h-11 rounded-xl bg-[#007E85] px-5 text-sm font-extrabold text-white shadow-sm hover:bg-[#006970] disabled:opacity-60"
          >
            {status === "loading" ? "Loading…" : "Apply filters"}
          </button>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </div>
      ) : null}

      {status === "ok" && doctors.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm font-semibold text-slate-600">
          No doctors match these filters. Try clearing specialization or day.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {doctors.map((d) => (
            <li key={d._id}>
              <DoctorCard doctor={d} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
