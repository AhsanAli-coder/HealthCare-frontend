import { useEffect, useState } from "react";
import * as doctorApi from "../../api/doctorApi.js";
import { pickEntity } from "../../api/apiResponse.js";

export default function DoctorProfileEditor({ onProfileLoaded }) {
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);
  const [saveMsg, setSaveMsg] = useState(null);

  const [specialization, setSpecialization] = useState("");
  const [experience, setExperience] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    setStatus("loading");
    setError(null);
    try {
      const res = await doctorApi.getMe();
      const doc = pickEntity(res) ?? res?.data ?? null;
      if (!doc) throw new Error("No profile data");
      setSpecialization(String(doc.specialization ?? ""));
      setExperience(
        doc.experience != null && doc.experience !== ""
          ? String(doc.experience)
          : "",
      );
      setConsultationFee(
        doc.consultationFee != null && doc.consultationFee !== ""
          ? String(doc.consultationFee)
          : "",
      );
      setBio(String(doc.bio ?? ""));
      if (onProfileLoaded) onProfileLoaded(doc);
      setStatus("ok");
    } catch (e) {
      setError(e?.data?.message ?? e?.message ?? "Could not load profile");
      setStatus("error");
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveMsg(null);
    try {
      const exp = Number(experience);
      const fee = Number(consultationFee);
      if (!specialization.trim()) {
        setSaveMsg("Specialization is required.");
        setSaving(false);
        return;
      }
      if (Number.isNaN(exp) || exp < 0) {
        setSaveMsg("Experience must be a valid number (years).");
        setSaving(false);
        return;
      }
      if (Number.isNaN(fee) || fee < 0) {
        setSaveMsg("Consultation fee must be a valid number.");
        setSaving(false);
        return;
      }

      const res = await doctorApi.updateDoctorProfile({
        specialization: specialization.trim(),
        experience: exp,
        consultationFee: fee,
        bio,
      });
      const doc = pickEntity(res) ?? res?.data ?? null;
      if (doc) {
        setSpecialization(String(doc.specialization ?? ""));
        setExperience(
          doc.experience != null ? String(doc.experience) : "",
        );
        setConsultationFee(
          doc.consultationFee != null ? String(doc.consultationFee) : "",
        );
        setBio(String(doc.bio ?? ""));
        if (onProfileLoaded) onProfileLoaded(doc);
      }
      setSaveMsg(res?.message ?? "Profile saved");
    } catch (e2) {
      setSaveMsg(
        e2?.data?.message ?? e2?.message ?? "Could not save profile",
      );
    } finally {
      setSaving(false);
    }
  }

  if (status === "loading") {
    return (
      <p className="text-sm font-semibold text-slate-600">Loading profile…</p>
    );
  }

  if (status === "error") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
        {error}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <h2 className="text-sm font-extrabold text-slate-900">
          Professional details
        </h2>
        <p className="mt-1 text-xs font-semibold text-slate-500">
          Shown to patients when browsing doctors. Saved via{" "}
          <span className="font-mono">PATCH /doctors/update-profile</span>.
        </p>
      </div>

      <label className="block">
        <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
          Specialization
        </span>
        <input
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          required
          className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Experience (years)
          </span>
          <input
            type="number"
            min={0}
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
            className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
          />
        </label>
        <label className="block">
          <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
            Consultation fee
          </span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={consultationFee}
            onChange={(e) => setConsultationFee(e.target.value)}
            required
            className="mt-1 h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs font-extrabold uppercase tracking-wide text-slate-500">
          Bio
        </span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={6}
          placeholder="Tell patients about your background, focus areas, and approach…"
          className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
        />
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="h-11 rounded-xl bg-[#007E85] px-5 text-sm font-extrabold text-white hover:bg-[#006970] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
        <button
          type="button"
          onClick={load}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
        >
          Reload
        </button>
        {saveMsg ? (
          <span className="text-sm font-semibold text-slate-700">{saveMsg}</span>
        ) : null}
      </div>
    </form>
  );
}
