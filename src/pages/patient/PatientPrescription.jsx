import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiError } from "../../api/http.js";
import {
  extractApiErrorMessage,
  pickPrescriptionRecord,
  pickSignedUrl,
} from "../../api/apiResponse.js";
import * as prescriptionApi from "../../api/prescriptionApi.js";

function Section({ title, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
        {title}
      </h2>
      <div className="mt-3 text-sm font-semibold text-slate-800">{children}</div>
    </div>
  );
}

export default function PatientPrescription() {
  const { appointmentId } = useParams();
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [pdfAction, setPdfAction] = useState("idle");
  const [pdfError, setPdfError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function run() {
      setStatus("loading");
      setError(null);
      try {
        const res = await prescriptionApi.getPrescription(appointmentId);
        const record = pickPrescriptionRecord(res);
        if (mounted) setData(record);
        if (mounted) setStatus("ok");
      } catch (e) {
        if (mounted) setError(extractApiErrorMessage(e));
        if (mounted) setStatus("error");
      }
    }
    if (appointmentId) run();
    return () => {
      mounted = false;
    };
  }, [appointmentId]);

  const hasPdfHint = Boolean(data?.pdfUrl);

  async function openPrescriptionPdf() {
    if (!appointmentId) return;
    setPdfAction("loading");
    setPdfError(null);
    try {
      let url = null;
      try {
        const res = await prescriptionApi.getPrescriptionSignedPdfUrl(
          appointmentId,
          { download: true },
        );
        url = pickSignedUrl(res);
      } catch (e) {
        const is404 = e instanceof ApiError && e.status === 404;
        if (!is404) throw e;
      }
      if (!url && data?.pdfUrl) url = data.pdfUrl;
      if (!url) throw new Error("No PDF URL available");
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setPdfError(extractApiErrorMessage(e));
    } finally {
      setPdfAction("idle");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Prescription</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Linked to appointment:{" "}
            <span className="font-mono text-slate-800">{appointmentId}</span>
          </p>
        </div>
        <Link
          to="/patient/appointments"
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50 inline-flex items-center"
        >
          Back to appointments
        </Link>
      </div>

      {status === "loading" ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm font-semibold text-slate-600">
          Loading…
        </div>
      ) : null}

      {status === "error" ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </div>
      ) : null}

      {status === "ok" && !data ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          No prescription was returned for this appointment. If the doctor just
          saved one, refresh or confirm the API returns the record on{" "}
          <span className="font-mono">GET /prescriptions/:appointmentId</span>{" "}
          for this patient.
        </div>
      ) : null}

      {status === "ok" && data ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <Section title="Diagnosis">{data.diagnosis || "—"}</Section>

          <Section title="Doctor">
            {data?.doctorId?.userId?.name ??
              data?.doctor?.userId?.name ??
              data?.doctor?.name ??
              data?.doctorName ??
              "—"}
          </Section>

          <Section title="Medicines">
            {Array.isArray(data.medicines) && data.medicines.length ? (
              <ul className="space-y-2">
                {data.medicines.map((m, idx) => (
                  <li
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2"
                  >
                    <div className="font-extrabold text-slate-900">
                      {m.name}
                    </div>
                    <div className="text-xs text-slate-600">
                      {m.dosage} • {m.duration}
                      {m.instructions ? ` • ${m.instructions}` : ""}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              "—"
            )}
          </Section>

          <Section title="Advice">{data.advice || "—"}</Section>

          {hasPdfHint ? (
            <div className="lg:col-span-2 space-y-2">
              <button
                type="button"
                onClick={openPrescriptionPdf}
                disabled={pdfAction === "loading"}
                className="inline-flex h-11 items-center rounded-xl bg-[#007E85] px-5 text-sm font-extrabold text-white hover:bg-[#006970] disabled:opacity-60"
              >
                {pdfAction === "loading" ? "Opening…" : "Download / open PDF"}
              </button>
              <p className="text-xs font-semibold text-slate-500">
                Prefers a time-limited signed link when your API supports it; falls
                back to the stored file URL if that route is not deployed yet.
              </p>
              {pdfError ? (
                <p className="text-xs font-semibold text-red-700">{pdfError}</p>
              ) : null}
            </div>
          ) : (
            <p className="lg:col-span-2 text-xs font-semibold text-slate-500">
              PDF is not available yet (generation may have failed on the server).
              You can still view the prescription details above.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

