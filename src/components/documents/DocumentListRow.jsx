import { useState } from "react";
import * as documentApi from "../../api/documentApi.js";
import { pickSignedUrl } from "../../api/apiResponse.js";

export function fileNameFromDoc(doc) {
  const safeTitle = String(doc?.title || "document")
    .trim()
    .replace(/[^\w\-]+/g, "_")
    .slice(0, 80);
  const ext = doc?.fileType ? `.${String(doc.fileType).toLowerCase()}` : "";
  return `${safeTitle}${ext}`;
}

function openInNewTab(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

export default function DocumentListRow({ doc }) {
  const [dlStatus, setDlStatus] = useState("idle");
  const [dlMsg, setDlMsg] = useState(null);
  const [lastSignedUrl, setLastSignedUrl] = useState(null);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4">
      <div className="min-w-0">
        <div className="truncate text-sm font-extrabold text-slate-900">
          {doc.title}
        </div>
        <div className="mt-1 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-1">
            {doc.category}
          </span>
          <span className="rounded-full bg-slate-100 px-2 py-1">
            {doc.fileType}
          </span>
        </div>
        {doc.description ? (
          <p className="mt-2 line-clamp-2 text-sm text-slate-600">
            {doc.description}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={async () => {
              setDlStatus("loading");
              setDlMsg(null);
              setLastSignedUrl(null);
              try {
                if (!doc?._id) throw new Error("Missing document id");
                const res = await documentApi.getDocumentSignedUrl(doc._id, {
                  download: false,
                });
                const url = pickSignedUrl(res);
                if (!url) throw new Error("Missing signed url");
                setLastSignedUrl(url);
                openInNewTab(url);
                setDlStatus("ok");
                setDlMsg(null);
              } catch (e) {
                setDlStatus("error");
                setDlMsg(
                  e?.data?.message ??
                    e?.message ??
                    "Signed URL request failed (backend).",
                );
              }
            }}
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
          >
            Open
          </button>
          <button
            type="button"
            onClick={async () => {
              setDlStatus("loading");
              setDlMsg(null);
              setLastSignedUrl(null);
              try {
                if (!doc?._id) throw new Error("Missing document id");
                const res = await documentApi.getDocumentSignedUrl(doc._id, {
                  download: true,
                });
                const url = pickSignedUrl(res);
                if (!url) throw new Error("Missing signed url");
                setLastSignedUrl(url);

                const a = document.createElement("a");
                a.href = url;
                a.target = "_blank";
                a.rel = "noreferrer";
                a.download = fileNameFromDoc(doc);
                document.body.appendChild(a);
                a.click();
                a.remove();

                setDlStatus("ok");
                setDlMsg("Download started");
              } catch (e2) {
                setDlStatus("error");
                setDlMsg(
                  e2?.data?.message ??
                    e2?.message ??
                    "Signed URL request failed (backend).",
                );
              }
            }}
            disabled={dlStatus === "loading"}
            className="inline-flex h-10 items-center rounded-xl bg-[#007E85] px-4 text-sm font-extrabold text-white hover:bg-[#006970] disabled:opacity-60"
          >
            {dlStatus === "loading" ? "Downloading…" : "Download"}
          </button>
        </div>
        {dlMsg ? (
          <div
            className={[
              "text-xs font-semibold",
              dlStatus === "error" ? "text-red-700" : "text-emerald-700",
            ].join(" ")}
          >
            {dlMsg}
          </div>
        ) : null}

        {lastSignedUrl ? (
          <button
            type="button"
            className="text-xs font-extrabold text-slate-500 hover:text-slate-700"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(lastSignedUrl);
                setDlStatus("ok");
                setDlMsg("Signed URL copied");
              } catch {
                setDlStatus("error");
                setDlMsg("Could not copy URL");
              }
            }}
          >
            Copy signed link
          </button>
        ) : null}
      </div>
    </div>
  );
}
