import { useEffect, useRef, useState } from "react";
import * as userApi from "../../api/userApi.js";
import { pickEntity } from "../../api/apiResponse.js";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";
import { setCredentials } from "../../store/slices/authSlice.js";

const MAX_BYTES = 5 * 1024 * 1024;

function mergeUserResponse(user, role, res) {
  const patch = pickEntity(res) ?? res?.data ?? null;
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
    return { user, role };
  }
  const next = { ...(user ?? {}), ...patch };
  return {
    user: next,
    role: patch.role ?? role ?? user?.role,
  };
}

/**
 * @param {{ layout?: "panel" | "inline"; avatarClassName?: string }} props
 */
export default function ProfilePhotoSettingsPanel({
  layout = "panel",
  avatarClassName = "",
}) {
  const dispatch = useAppDispatch();
  const { user, role } = useAppSelector((s) => s.auth);
  const inputRef = useRef(null);
  const [picked, setPicked] = useState(null);
  const [preview, setPreview] = useState(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  const displayUrl = preview || user?.profilePhoto || null;

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function onPickFile(e) {
    const file = e.target.files?.[0];
    setMessage(null);
    setStatus("idle");
    if (!file) {
      setPicked(null);
      setPreview(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      setPicked(null);
      setPreview(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setMessage("Image must be 5 MB or smaller.");
      setPicked(null);
      setPreview(null);
      return;
    }
    setPicked(file);
    setPreview((prev) => {
      if (prev?.startsWith("blob:")) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  }

  async function onUpload() {
    if (!picked) {
      setMessage("Choose an image first.");
      return;
    }
    setStatus("loading");
    setMessage(null);
    try {
      const res = await userApi.updateProfilePhoto(picked);
      const { user: nextUser, role: nextRole } = mergeUserResponse(
        user,
        role,
        res,
      );
      dispatch(setCredentials({ user: nextUser, role: nextRole }));
      setStatus("ok");
      setMessage(res?.message ?? "Profile photo updated");
      setPicked(null);
      if (inputRef.current) inputRef.current.value = "";
      setPreview(null);
    } catch (err) {
      setStatus("error");
      setMessage(
        err?.data?.message ?? err?.message ?? "Could not update photo",
      );
    }
  }

  const avatarRing =
    layout === "inline"
      ? "ring-8 ring-sky-100"
      : "ring-4 ring-slate-100";

  const circleClass =
    layout === "inline"
      ? `h-24 w-24 overflow-hidden rounded-full bg-slate-200 ${avatarRing} ${avatarClassName}`
      : `h-28 w-28 overflow-hidden rounded-full bg-slate-200 ${avatarRing} ${avatarClassName}`;

  const rowClass =
    layout === "inline"
      ? "flex flex-col items-center gap-4 text-center"
      : "flex flex-col items-center gap-4 sm:flex-row sm:items-start";

  const inner = (
    <>
      <div className={rowClass}>
        <div className={circleClass}>
          {displayUrl ? (
            <img
              src={displayUrl}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full items-center justify-center text-xs font-bold text-slate-500"
              aria-hidden
            >
              No photo
            </div>
          )}
        </div>

        <div
          className={`flex w-full flex-col gap-2 ${layout === "inline" ? "" : "max-w-md sm:pt-1"}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="text-sm font-semibold text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#007E85] file:px-4 file:py-2 file:text-sm file:font-extrabold file:text-white hover:file:bg-[#006970]"
            onChange={onPickFile}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={onUpload}
              disabled={!picked || status === "loading"}
              className="h-10 rounded-xl bg-[#007E85] px-4 text-sm font-extrabold text-white hover:bg-[#006970] disabled:opacity-60"
            >
              {status === "loading" ? "Uploading…" : "Save photo"}
            </button>
          </div>
          <p className="text-xs font-semibold text-slate-500">
            JPG, PNG, or WebP · max 5 MB
          </p>
        </div>
      </div>

      {status === "ok" && message ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
          {message}
        </div>
      ) : null}

      {(status === "error" || (message && status !== "ok")) && message ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {message}
        </div>
      ) : null}
    </>
  );

  if (layout === "inline") {
    return <div className="w-full">{inner}</div>;
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-sm font-extrabold text-slate-900">Profile photo</h2>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        This image may appear to doctors or patients depending on your role.
      </p>
      <div className="mt-5">{inner}</div>
    </div>
  );
}
