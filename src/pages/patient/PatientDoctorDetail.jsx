import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as patientApi from "../../api/patientApi.js";

export default function PatientDoctorDetail() {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      setStatus("loading");
      setError(null);
      try {
        const res = await patientApi.getDoctorDetails(doctorId);
        if (!cancelled) {
          setDoctor(res?.data ?? null);
          setStatus("ok");
        }
      } catch (e) {
        if (!cancelled) {
          setError(e?.message ?? "Could not load doctor");
          setStatus("error");
        }
      }
    }
    if (doctorId) run();
    return () => {
      cancelled = true;
    };
  }, [doctorId]);

  const user = doctor?.userId;
  const name =
    typeof user === "object" && user?.name ? user.name : "Doctor";
  const photo =
    typeof user === "object" && user?.profilePhoto ? user.profilePhoto : null;

  if (status === "loading") {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-600">
        Loading doctor…
      </div>
    );
  }

  if (status === "error" || !doctor) {
    return (
      <div className="space-y-4">
        <Link
          to="/patient/doctors"
          className="text-sm font-extrabold text-[#007E85] hover:underline"
        >
          ← Back to doctors
        </Link>
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error ?? "Doctor not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        to="/patient/doctors"
        className="inline-block text-sm font-extrabold text-[#007E85] hover:underline"
      >
        ← Back to doctors
      </Link>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-start">
          <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
            {photo ? (
              <img
                src={photo}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-3xl font-extrabold text-slate-400">
                {name.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-extrabold text-slate-900">{name}</h1>
            <p className="mt-1 text-base font-semibold text-[#007E85]">
              {doctor.specialization}
            </p>
            <dl className="mt-4 grid gap-2 text-sm font-semibold text-slate-600 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Experience
                </dt>
                <dd>{doctor.experience} years</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Consultation fee
                </dt>
                <dd>${doctor.consultationFee}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-400">
                  Rating
                </dt>
                <dd>
                  {Number(doctor.averageRating ?? 0).toFixed(1)} (
                  {doctor.totalReviews ?? 0} reviews)
                </dd>
              </div>
              {typeof user === "object" && user?.email ? (
                <div>
                  <dt className="text-xs uppercase tracking-wide text-slate-400">
                    Email
                  </dt>
                  <dd className="truncate">{user.email}</dd>
                </div>
              ) : null}
            </dl>
          </div>
        </div>

        {doctor.bio ? (
          <div className="border-t border-slate-100 px-6 py-5">
            <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              About
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              {doctor.bio}
            </p>
          </div>
        ) : null}

        {Array.isArray(doctor.availability) && doctor.availability.length ? (
          <div className="border-t border-slate-100 px-6 py-5">
            <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Availability
            </h2>
            <ul className="mt-3 space-y-2 text-sm font-semibold text-slate-700">
              {doctor.availability.map((slot, idx) => (
                <li key={`${slot.day}-${idx}`}>
                  {slot.day}: {slot.startTime} – {slot.endTime}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}
