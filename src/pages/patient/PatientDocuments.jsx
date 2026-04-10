import { useEffect, useMemo, useState } from "react";
import * as documentApi from "../../api/documentApi.js";
import DocumentListRow from "../../components/documents/DocumentListRow.jsx";

const CATEGORIES = [
  { value: "medical-history", label: "Medical history" },
  { value: "lab-report", label: "Lab report" },
  { value: "instruction", label: "Instruction" },
  { value: "other", label: "Other" },
];

export default function PatientDocuments() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("medical-history");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadMsg, setUploadMsg] = useState(null);

  async function load() {
    setStatus("loading");
    setError(null);
    try {
      const res = await documentApi.getMyDocuments();
      const list = Array.isArray(res?.data) ? res.data : [];
      setItems(list);
      setStatus("ok");
    } catch (e) {
      setError(e?.data?.message ?? e?.message ?? "Could not load documents");
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const canUpload = useMemo(() => {
    return Boolean(title.trim() && category && file);
  }, [title, category, file]);

  async function onUpload(e) {
    e.preventDefault();
    if (!canUpload) return;
    setUploadStatus("loading");
    setUploadMsg(null);
    try {
      const res = await documentApi.uploadMyDocument({
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
      await load();
    } catch (e2) {
      setUploadStatus("error");
      setUploadMsg(
        e2?.data?.message ?? e2?.message ?? "Could not upload document",
      );
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900">Documents</h1>
          <p className="mt-1 text-sm font-semibold text-slate-600">
            Upload your medical files (PDF/JPG) and keep them organized.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
        >
          Refresh
        </button>
      </div>

      <form
        onSubmit={onUpload}
        className="rounded-2xl border border-slate-200 bg-white p-6"
      >
        <h2 className="text-sm font-extrabold text-slate-900">
          Upload a document
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
              Title
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blood test report"
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
              rows={3}
              placeholder="Any notes about this document..."
              className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
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
            className="h-11 rounded-xl bg-[#007E85] px-5 text-sm font-extrabold text-white shadow-sm hover:bg-[#006970] disabled:opacity-60"
          >
            {uploadStatus === "loading" ? "Uploading…" : "Upload"}
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

      {status === "error" ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {error}
        </div>
      ) : null}

      <div className="space-y-3">
        {items.map((d) => (
          <DocumentListRow key={d._id} doc={d} />
        ))}
        {status === "ok" && items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center text-sm font-semibold text-slate-600">
            No documents yet. Upload your first file above.
          </div>
        ) : null}
      </div>
    </div>
  );
}
