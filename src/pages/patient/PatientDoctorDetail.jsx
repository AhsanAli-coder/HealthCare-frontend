import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import * as patientApi from "../../api/patientApi.js";
import { useAppSelector } from "../../store/hooks.js";

function toYmd(d) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatTimeFromUtc(utcIso, tz, { hour12 = true } = {}) {
  try {
    const dt = new Date(utcIso);
    if (Number.isNaN(dt.getTime())) return "—";
    return new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12,
      timeZone: tz,
    }).format(dt);
  } catch {
    return "—";
  }
}

function formatHHmmFromUtc(utcIso, tz) {
  try {
    const dt = new Date(utcIso);
    if (Number.isNaN(dt.getTime())) return "";
    // Use en-GB to guarantee 24h with leading zeros.
    return new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: tz,
    }).format(dt);
  } catch {
    return "";
  }
}

export default function PatientDoctorDetail() {
  const { doctorId } = useParams();
  const { user: authUser } = useAppSelector((s) => s.auth);
  const [doctor, setDoctor] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const [slotDate, setSlotDate] = useState(() => toYmd(new Date()));
  const [slotMinutes, setSlotMinutes] = useState(30);
  const [bufferMinutes, setBufferMinutes] = useState(0);
  const [slotsStatus, setSlotsStatus] = useState("idle");
  const [slotsError, setSlotsError] = useState(null);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingStatus, setBookingStatus] = useState("idle");
  const [bookingError, setBookingError] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  const timezone = useMemo(() => {
    return (
      authUser?.timezone ||
      Intl.DateTimeFormat().resolvedOptions().timeZone ||
      "UTC"
    );
  }, [authUser?.timezone]);

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

  useEffect(() => {
    let cancelled = false;
    async function runSlots() {
      if (!doctorId || !slotDate) return;
      setSlotsStatus("loading");
      setSlotsError(null);
      setSelectedSlot(null);
      setBookingStatus("idle");
      setBookingError(null);
      setBookingSuccess(null);
      try {
        const res = await patientApi.getDoctorAvailableSlots(doctorId, {
          date: slotDate,
          tz: timezone,
          slotMinutes,
          bufferMinutes,
        });
        const list = Array.isArray(res?.data?.slots) ? res.data.slots : [];
        if (!cancelled) {
          setSlots(list);
          setSlotsStatus("ok");
        }
      } catch (e) {
        if (!cancelled) {
          setSlots([]);
          setSlotsError(e?.message ?? "Could not load slots");
          setSlotsStatus("error");
        }
      }
    }
    runSlots();
    return () => {
      cancelled = true;
    };
  }, [doctorId, slotDate, timezone, slotMinutes, bufferMinutes]);

  async function onBookSelected() {
    if (!selectedSlot) return;
    setBookingStatus("loading");
    setBookingError(null);
    setBookingSuccess(null);
    try {
      const startTime = formatHHmmFromUtc(selectedSlot.startAtUtc, timezone);
      const endTime = formatHHmmFromUtc(selectedSlot.endAtUtc, timezone);
      const res = await patientApi.bookAppointment({
        doctorId,
        date: slotDate,
        startTime,
        endTime,
        startAt: selectedSlot.startAtUtc,
        endAt: selectedSlot.endAtUtc,
      });
      setBookingStatus("ok");
      setBookingSuccess(res?.message ?? "Appointment requested successfully");
    } catch (e) {
      setBookingStatus("error");
      const msg = e?.data?.message ?? e?.message ?? "Booking failed";
      // If backend still has a hard unique index on (doctorId,date,startTime),
      // Mongo may throw E11000 even when a previous request was rejected.
      if (
        String(msg).includes("E11000") ||
        String(msg).toLowerCase().includes("duplicate key") ||
        e?.status === 409
      ) {
        setBookingError(
          "This slot is blocked by a database unique constraint. If the previous appointment was rejected/cancelled, you can only rebook after the backend updates the index to allow rebooking.",
        );
      } else {
        setBookingError(msg);
      }
    }
  }

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

        {/* Step 2A (FR-004): show available slots */}
        <div className="border-t border-slate-100 px-6 py-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Available slots
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-600">
                Slots use <span className="font-extrabold text-slate-800">your</span>{" "}
                saved timezone (
                <span className="font-mono font-extrabold text-slate-800">
                  {timezone}
                </span>
                ), not the doctor’s. Set it under Patient → Settings if needed.
              </p>
            </div>
            <label className="block">
              <span className="sr-only">Date</span>
              <input
                type="date"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
              />
            </label>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Slot length
              </span>
              <select
                value={slotMinutes}
                onChange={(e) => setSlotMinutes(Number(e.target.value))}
                className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
              >
                {[15, 30, 45, 60].map((m) => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Buffer
              </span>
              <select
                value={bufferMinutes}
                onChange={(e) => setBufferMinutes(Number(e.target.value))}
                className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
              >
                {[0, 5, 10, 15].map((m) => (
                  <option key={m} value={m}>
                    {m} minutes
                  </option>
                ))}
              </select>
            </label>
          </div>

          {slotsStatus === "loading" ? (
            <div className="mt-4 text-sm font-semibold text-slate-600">
              Loading slots…
            </div>
          ) : null}

          {slotsStatus === "error" ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              {slotsError}
            </div>
          ) : null}

          {slotsStatus === "ok" && slots.length === 0 ? (
            <div className="mt-4 rounded-xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm font-semibold text-slate-600">
              No available slots for this date.
            </div>
          ) : null}

          {slotsStatus === "ok" && slots.length ? (
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {slots.slice(0, 18).map((s) => (
                <button
                  key={s.startAtUtc}
                  type="button"
                  onClick={() => {
                    setSelectedSlot(s);
                    setBookingStatus("idle");
                    setBookingError(null);
                    setBookingSuccess(null);
                  }}
                  className={[
                    "rounded-xl border px-3 py-3 text-left text-sm font-extrabold transition",
                    selectedSlot?.startAtUtc === s.startAtUtc
                      ? "border-[#007E85] bg-white text-slate-900 ring-2 ring-[#007E85]/15"
                      : "border-slate-200 bg-slate-50 text-slate-800 hover:border-[#007E85]/40 hover:bg-white",
                  ].join(" ")}
                >
                  {formatTimeFromUtc(s.startAtUtc, timezone)} –{" "}
                  {formatTimeFromUtc(s.endAtUtc, timezone)}
                </button>
              ))}
            </div>
          ) : null}

          {selectedSlot ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-extrabold text-slate-900">
                    Selected: {formatTimeFromUtc(selectedSlot.startAtUtc, timezone)} –{" "}
                    {formatTimeFromUtc(selectedSlot.endAtUtc, timezone)}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    This will create a <span className="font-extrabold">pending</span>{" "}
                    request for the doctor to confirm.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onBookSelected}
                  disabled={bookingStatus === "loading"}
                  className="h-11 rounded-xl bg-[#007E85] px-5 text-sm font-extrabold text-white shadow-sm hover:bg-[#006970] disabled:opacity-60"
                >
                  {bookingStatus === "loading" ? "Booking…" : "Book appointment"}
                </button>
              </div>

              {bookingStatus === "error" && bookingError ? (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                  {bookingError}
                </div>
              ) : null}

              {bookingStatus === "ok" && bookingSuccess ? (
                <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">
                  {bookingSuccess}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-4 text-xs font-semibold text-slate-500">
              Step 2B: select a slot, then click <span className="font-extrabold">Book appointment</span>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
