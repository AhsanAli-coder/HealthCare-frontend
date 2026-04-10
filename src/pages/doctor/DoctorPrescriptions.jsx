import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DoctorTopbar from "../../components/doctor/layout/DoctorTopbar.jsx";
import * as appointmentApi from "../../api/appointmentApi.js";
import * as prescriptionApi from "../../api/prescriptionApi.js";
import { useAppSelector } from "../../store/hooks.js";
import { formatAppointmentWhen } from "../../utils/appointmentTime.js";

function emptyMedicine() {
  return { name: "", dosage: "", duration: "", instructions: "" };
}

export default function DoctorPrescriptions() {
  const { user } = useAppSelector((s) => s.auth);
  const viewerTz =
    user?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const [params] = useSearchParams();
  const preselectId = params.get("appointmentId") || "";

  const [appointments, setAppointments] = useState([]);
  const [loadStatus, setLoadStatus] = useState("loading");
  const [loadError, setLoadError] = useState(null);

  const [appointmentId, setAppointmentId] = useState(preselectId);
  const [diagnosis, setDiagnosis] = useState("");
  const [advice, setAdvice] = useState("");
  const [medicines, setMedicines] = useState([emptyMedicine()]);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitMsg, setSubmitMsg] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoadStatus("loading");
      setLoadError(null);
      try {
        const res = await appointmentApi.getDoctorAppointments();
        const list = Array.isArray(res?.data) ? res.data : [];
        if (mounted) setAppointments(list);
        if (mounted) setLoadStatus("ok");
      } catch (e) {
        if (mounted)
          setLoadError(e?.data?.message ?? e?.message ?? "Could not load");
        if (mounted) setLoadStatus("error");
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (preselectId) setAppointmentId(preselectId);
  }, [preselectId]);

  const confirmed = useMemo(() => {
    return appointments.filter(
      (a) => String(a?.status || "").toLowerCase() === "confirmed",
    );
  }, [appointments]);

  function updateMedicine(i, field, value) {
    setMedicines((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)),
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!appointmentId) return;
    const payloadMedicines = medicines
      .map((m) => ({
        name: m.name.trim(),
        dosage: m.dosage.trim(),
        duration: m.duration.trim(),
        instructions: m.instructions.trim() || undefined,
      }))
      .filter((m) => m.name && m.dosage && m.duration);

    if (!diagnosis.trim() || payloadMedicines.length === 0) {
      setSubmitStatus("error");
      setSubmitMsg("Diagnosis and at least one complete medicine row are required.");
      return;
    }

    setSubmitStatus("loading");
    setSubmitMsg(null);
    try {
      const res = await prescriptionApi.createPrescription(appointmentId, {
        diagnosis: diagnosis.trim(),
        medicines: payloadMedicines,
        advice: advice.trim() || undefined,
      });
      setSubmitStatus("ok");
      setSubmitMsg(res?.message ?? "Prescription created");
      setDiagnosis("");
      setAdvice("");
      setMedicines([emptyMedicine()]);
      setAppointmentId("");
      const res2 = await appointmentApi.getDoctorAppointments();
      setAppointments(Array.isArray(res2?.data) ? res2.data : []);
    } catch (err) {
      setSubmitStatus("error");
      setSubmitMsg(
        err?.data?.message ?? err?.message ?? "Could not create prescription",
      );
    }
  }

  return (
    <>
      <DoctorTopbar title="Prescriptions" subtitle="Create prescription after visit" />

      <div className="mx-auto max-w-[900px] px-6 py-6">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
          <p className="text-sm font-semibold text-slate-600">
            Choose a <span className="font-extrabold text-slate-900">confirmed</span>{" "}
            appointment. Submitting creates the prescription and marks the appointment{" "}
            <span className="font-extrabold text-slate-900">completed</span> (per backend).
          </p>

          {loadStatus === "error" ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              {loadError}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Appointment
              </span>
              <select
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
              >
                <option value="">Select confirmed appointment…</option>
                {confirmed.map((a) => {
                  const id = a?._id ?? a?.id;
                  const p = a?.patientId;
                  const name =
                    typeof p === "object" && p?.name ? p.name : "Patient";
                  const when = a?.startAt
                    ? formatAppointmentWhen(a.startAt, viewerTz)
                    : "—";
                  return (
                    <option key={id} value={id}>
                      {name} — {when}
                    </option>
                  );
                })}
              </select>
            </label>

            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Diagnosis
              </span>
              <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                rows={3}
                required
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
              />
            </label>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Medicines
                </span>
                <button
                  type="button"
                  onClick={() => setMedicines((prev) => [...prev, emptyMedicine()])}
                  className="text-xs font-extrabold text-[#007E85] hover:underline"
                >
                  + Add medicine
                </button>
              </div>
              <div className="mt-3 space-y-3">
                {medicines.map((m, i) => (
                  <div
                    key={i}
                    className="grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2"
                  >
                    <input
                      placeholder="Name"
                      value={m.name}
                      onChange={(e) => updateMedicine(i, "name", e.target.value)}
                      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                    />
                    <input
                      placeholder="Dosage"
                      value={m.dosage}
                      onChange={(e) => updateMedicine(i, "dosage", e.target.value)}
                      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                    />
                    <input
                      placeholder="Duration"
                      value={m.duration}
                      onChange={(e) => updateMedicine(i, "duration", e.target.value)}
                      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm"
                    />
                    <input
                      placeholder="Instructions (optional)"
                      value={m.instructions}
                      onChange={(e) =>
                        updateMedicine(i, "instructions", e.target.value)
                      }
                      className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm sm:col-span-2"
                    />
                    {medicines.length > 1 ? (
                      <button
                        type="button"
                        onClick={() =>
                          setMedicines((prev) => prev.filter((_, j) => j !== i))
                        }
                        className="text-xs font-extrabold text-red-600 hover:underline sm:col-span-2"
                      >
                        Remove
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                Advice (optional)
              </span>
              <textarea
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                rows={2}
                className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
              />
            </label>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={submitStatus === "loading" || !appointmentId}
                className="h-11 rounded-xl bg-[#007E85] px-5 text-sm font-extrabold text-white hover:bg-[#006970] disabled:opacity-60"
              >
                {submitStatus === "loading" ? "Saving…" : "Save prescription"}
              </button>
              <Link
                to="/doctor/appointments"
                className="inline-flex h-11 items-center rounded-xl border border-slate-200 bg-white px-5 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
              >
                Back to appointments
              </Link>
            </div>

            {submitMsg ? (
              <div
                className={[
                  "rounded-xl px-4 py-3 text-sm font-semibold ring-1",
                  submitStatus === "ok"
                    ? "bg-emerald-50 text-emerald-900 ring-emerald-200"
                    : "bg-red-50 text-red-800 ring-red-200",
                ].join(" ")}
              >
                {submitMsg}
              </div>
            ) : null}
          </form>
        </div>
      </div>
    </>
  );
}
