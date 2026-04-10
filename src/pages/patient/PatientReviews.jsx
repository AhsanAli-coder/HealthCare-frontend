import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as appointmentApi from "../../api/appointmentApi.js";
import * as reviewApi from "../../api/reviewApi.js";

function StarPicker({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => {
        const n = i + 1;
        const active = n <= value;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={[
              "text-2xl leading-none",
              active ? "text-amber-400" : "text-slate-300 hover:text-amber-300",
            ].join(" ")}
            aria-label={`Rate ${n}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

export default function PatientReviews() {
  const [params] = useSearchParams();
  const appointmentIdFromUrl = params.get("appointmentId") || "";

  const [appointments, setAppointments] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const [appointmentId, setAppointmentId] = useState(appointmentIdFromUrl);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitMsg, setSubmitMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setStatus("loading");
      setError(null);
      try {
        const res = await appointmentApi.getPatientAppointments();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setAppointments(list);
        if (mounted) setStatus("ok");
      } catch (e) {
        if (mounted) setError(e?.message ?? "Could not load appointments");
        if (mounted) setStatus("error");
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const completed = useMemo(() => {
    return appointments.filter(
      (a) => String(a?.status || "").toLowerCase() === "completed",
    );
  }, [appointments]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!appointmentId) return;
    setSubmitStatus("loading");
    setSubmitMsg(null);
    try {
      const res = await reviewApi.createReview(appointmentId, {
        rating,
        comment,
      });
      setSubmitStatus("ok");
      setSubmitMsg(res?.message ?? "Review submitted");
      setComment("");
      // Prevent accidentally submitting the same appointment again.
      setAppointments((prev) => prev.filter((a) => a?._id !== appointmentId));
      setAppointmentId("");
      setRating(5);
    } catch (err) {
      setSubmitStatus("error");
      setSubmitMsg(
        err?.data?.message ?? err?.message ?? "Could not submit review",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Reviews</h1>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          You can only review appointments that are marked as completed.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h2 className="text-sm font-extrabold text-slate-900">
          Leave a review
        </h2>

        {status === "error" ? (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
            {error}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-4 space-y-4">
          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Completed appointment
            </span>
            <select
              value={appointmentId}
              onChange={(e) => setAppointmentId(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            >
              <option value="">Select an appointment…</option>
              {completed.map((a) => (
                <option key={a._id} value={a._id}>
                  {a?.doctorId?.userId?.name ?? "Doctor"} —{" "}
                  {a?.startAt
                    ? new Date(a.startAt).toLocaleString()
                    : a?.date}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Rating
            </span>
            <div className="mt-2">
              <StarPicker value={rating} onChange={setRating} />
            </div>
          </div>

          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Comment
            </span>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Write your feedback..."
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            />
          </label>

          <button
            type="submit"
            disabled={submitStatus === "loading" || !appointmentId}
            className="h-11 rounded-xl bg-[#007E85] px-5 text-sm font-extrabold text-white shadow-sm hover:bg-[#006970] disabled:opacity-60"
          >
            {submitStatus === "loading" ? "Submitting…" : "Submit review"}
          </button>

          {submitMsg ? (
            <div
              className={[
                "rounded-xl px-4 py-3 text-sm font-semibold ring-1",
                submitStatus === "ok"
                  ? "bg-emerald-50 text-emerald-900 ring-emerald-200"
                  : submitStatus === "error"
                    ? "bg-red-50 text-red-800 ring-red-200"
                    : "bg-slate-50 text-slate-700 ring-slate-200",
              ].join(" ")}
            >
              {submitMsg}
            </div>
          ) : null}
        </form>
      </div>
    </div>
  );
}

