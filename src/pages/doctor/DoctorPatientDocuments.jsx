import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import DoctorTopbar from "../../components/doctor/layout/DoctorTopbar.jsx";
import DocumentListRow from "../../components/documents/DocumentListRow.jsx";
import * as documentApi from "../../api/documentApi.js";
import * as appointmentApi from "../../api/appointmentApi.js";

const CATEGORIES = [
  { value: "lab-report", label: "Lab report" },
  { value: "instruction", label: "Instruction / handout" },
  { value: "medical-history", label: "Medical history" },
  { value: "other", label: "Other" },
];

function patientIdFromAppointment(a) {
  const p = a?.patientId;
  if (!p) return "";
  if (typeof p === "string") return p;
  return p._id ?? p.id ?? "";
}

function patientLabelFromAppointment(a) {
  const p = a?.patientId;
  if (typeof p === "object" && p?.name) return p.name;
  return "Patient";
}

export default function DoctorPatientDocuments() {
  const [params] = useSearchParams();
  const initialPatientId = params.get("patientId") || "";

  const [appointments, setAppointments] = useState([]);
  const [apptStatus, setApptStatus] = useState("loading");
  const [apptError, setApptError] = useState(null);

  const [patientId, setPatientId] = useState(initialPatientId);
  const [items, setItems] = useState([]);
  const [docStatus, setDocStatus] = useState("idle");
  const [docError, setDocError] = useState(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("lab-report");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadMsg, setUploadMsg] = useState(null);

  useEffect(() => {
    if (initialPatientId) setPatientId(initialPatientId);
  }, [initialPatientId]);

  async function loadAppointments() {
    setApptStatus("loading");
    setApptError(null);
    try {
      const res = await appointmentApi.getDoctorAppointments();
      const list = Array.isArray(res?.data) ? res.data : [];
      setAppointments(list);
      setApptStatus("ok");
    } catch (e) {
      setApptError(e?.data?.message ?? e?.message ?? "Could not load appointments");
      setApptStatus("error");
    }
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  const patientOptions = useMemo(() => {
    const map = new Map();
    for (const a of appointments) {
      const id = patientIdFromAppointment(a);
      if (!id || map.has(id)) continue;
      map.set(id, {
        id,
        label: patientLabelFromAppointment(a),
      });
    }
    return [...map.values()].sort((x, y) =>
      x.label.localeCompare(y.label, undefined, { sensitivity: "base" }),
    );
  }, [appointments]);

  async function loadDocuments(forId = patientId) {
    if (!forId) {
      setItems([]);
      setDocStatus("idle");
      setDocError(null);
      return;
    }
    setDocStatus("loading");
    setDocError(null);
    try {
      const res = await documentApi.getPatientDocuments(forId);
      const list = Array.isArray(res?.data) ? res.data : [];
      setItems(list);
      setDocStatus("ok");
    } catch (e) {
      setDocError(
        e?.data?.message ??
          e?.message ??
          "Could not load patient documents (check doctor GET /documents/patient/:patientId).",
      );
      setItems([]);
      setDocStatus("error");
    }
  }

  useEffect(() => {
    loadDocuments(patientId);
  }, [patientId]);

  const canUpload = Boolean(patientId && title.trim() && category && file);

  async function onUpload(e) {
    e.preventDefault();
    if (!canUpload) return;
    setUploadStatus("loading");
    setUploadMsg(null);
    try {
      const res = await documentApi.uploadDocumentForPatient({
        patientId,
        title: title.trim(),
        category,
        description: description.trim(),
        file,
      });
      setUploadStatus("ok");
      setUploadMsg(res?.message ?? "Uploaded");
      setTitle("");
      setDescription("");
      setFile(null);
      await loadDocuments(patientId);
    } catch (e2) {
      setUploadStatus("error");
      setUploadMsg(
        e2?.data?.message ??
          e2?.message ??
          "Upload failed (backend must accept patientId for doctors on POST /documents/upload).",
      );
    }
  }

  return (
    <>
      <DoctorTopbar
        title="Patient files"
        subtitle="View documents your patients uploaded and share resources"
      />

      <div className="mx-auto max-w-[900px] space-y-6 px-6 py-6">
        <p className="text-sm font-semibold text-slate-600">
          Select a patient you have appointments with. You will see their{" "}
          <span className="font-extrabold text-slate-900">medical uploads</span>{" "}
          and can add{" "}
          <span className="font-extrabold text-slate-900">
            lab reports or instructions
          </span>{" "}
          (FR-011).
        </p>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-200/70">
          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Patient
            </span>
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            >
              <option value="">Choose patient…</option>
              {patientOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>

          {apptStatus === "error" ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              {apptError}
            </div>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => loadAppointments()}
              className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
            >
              Refresh patient list
            </button>
            <Link
              to="/doctor/appointments"
              className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
            >
              Appointments
            </Link>
          </div>
        </div>

        {patientId ? (
          <form
            onSubmit={onUpload}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <h2 className="text-sm font-extrabold text-slate-900">
              Upload resource for this patient
            </h2>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              Backend: POST <span className="font-mono">/documents/upload</span>{" "}
              with <span className="font-mono">patientId</span> +{" "}
              <span className="font-mono">documentFile</span>.
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Title
                </span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Post-visit instructions"
                  className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
                />
              </label>
              <label className="block">
                <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Category
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  Description (optional)
                </span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
                />
              </label>
              <label className="block md:col-span-2">
                <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
                  File (PDF/JPG)
                </span>
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="mt-2 block w-full text-sm font-semibold text-slate-700 file:mr-4 file:rounded-xl file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-extrabold file:text-slate-700 hover:file:bg-slate-200"
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={!canUpload || uploadStatus === "loading"}
                className="h-11 rounded-xl bg-[#007E85] px-5 text-sm font-extrabold text-white hover:bg-[#006970] disabled:opacity-60"
              >
                {uploadStatus === "loading" ? "Uploading…" : "Upload for patient"}
              </button>
              {uploadMsg ? (
                <span
                  className={[
                    "text-sm font-semibold",
                    uploadStatus === "error"
                      ? "text-red-700"
                      : "text-emerald-700",
                  ].join(" ")}
                >
                  {uploadMsg}
                </span>
              ) : null}
            </div>
          </form>
        ) : null}

        <div>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-extrabold text-slate-900">
              Documents for selected patient
            </h2>
            {patientId ? (
              <button
                type="button"
                onClick={() => loadDocuments()}
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
              >
                Refresh list
              </button>
            ) : null}
          </div>

          {docStatus === "loading" ? (
            <p className="text-sm font-semibold text-slate-600">Loading…</p>
          ) : null}

          {docStatus === "error" ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              {docError}
            </div>
          ) : null}

          <div className="space-y-3">
            {items.map((d) => (
              <DocumentListRow key={d._id} doc={d} />
            ))}
            {patientId && docStatus === "ok" && items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm font-semibold text-slate-600">
                No documents yet for this patient.
              </div>
            ) : null}
            {!patientId ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm font-semibold text-slate-600">
                Pick a patient to load their files.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
