import { useState } from "react";
import * as userApi from "../../api/userApi.js";

export default function ChangePasswordPanel() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (newPassword.length < 8) {
      setStatus("error");
      setMessage("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("error");
      setMessage("New password and confirmation do not match.");
      return;
    }
    if (newPassword === oldPassword) {
      setStatus("error");
      setMessage("New password must be different from the current one.");
      return;
    }

    setStatus("loading");
    try {
      const res = await userApi.changePassword({
        oldPassword,
        newPassword,
      });
      setStatus("ok");
      setMessage(res?.message ?? "Password updated");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setStatus("error");
      setMessage(
        err?.data?.message ?? err?.message ?? "Could not change password",
      );
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-sm font-extrabold text-slate-900">Change password</h2>
      <p className="mt-1 text-sm font-semibold text-slate-600">
        Use a strong password you do not reuse on other sites.
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Current password
          </span>
          <input
            type="password"
            autoComplete="current-password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            className="mt-1 h-11 w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
          />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            New password
          </span>
          <input
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1 h-11 w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
          />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Confirm new password
          </span>
          <input
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="mt-1 h-11 w-full max-w-md rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
          />
        </label>

        <button
          type="submit"
          disabled={status === "loading"}
          className="h-11 rounded-xl bg-[#007E85] px-5 text-sm font-extrabold text-white shadow-sm hover:bg-[#006970] disabled:opacity-60"
        >
          {status === "loading" ? "Updating…" : "Update password"}
        </button>
      </form>

      {status === "ok" && message ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
          {message}
        </div>
      ) : null}

      {status === "error" && message ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
          {message}
        </div>
      ) : null}
    </div>
  );
}
