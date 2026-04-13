import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Toggle from "../ui/Toggle.jsx";

const STORAGE_KEY = "healthcare_doctor_notification_prefs_v1";

const defaultPrefs = {
  inAppMessages: true,
  inAppAppointments: true,
  inAppSystem: true,
};

function loadPrefs() {
  if (typeof window === "undefined") return { ...defaultPrefs };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultPrefs };
    const parsed = JSON.parse(raw);
    return { ...defaultPrefs, ...parsed };
  } catch {
    return { ...defaultPrefs };
  }
}

function Row({ title, description, checked, onChange, id }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 py-4 last:border-0">
      <div className="min-w-0 max-w-xl">
        <p className="text-sm font-extrabold text-slate-900">{title}</p>
        <p className="mt-1 text-xs font-semibold text-slate-500">{description}</p>
      </div>
      <Toggle id={id} checked={checked} onChange={onChange} />
    </div>
  );
}

export default function DoctorNotificationSettingsPanel() {
  const [prefs, setPrefs] = useState(loadPrefs);
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    setPrefs(loadPrefs());
  }, []);

  useEffect(() => {
    if (!savedFlash) return undefined;
    const id = window.setTimeout(() => setSavedFlash(false), 2000);
    return () => window.clearTimeout(id);
  }, [savedFlash]);

  const persist = useCallback((next) => {
    setPrefs(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setSavedFlash(true);
  }, []);

  function update(key, value) {
    persist({ ...prefs, [key]: value });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-extrabold text-slate-900">Notifications</h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          Control in-app alerts (bell icon). Preferences are saved on this
          device. Email delivery is configured on the server, not here.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white px-5 py-2 shadow-sm shadow-slate-900/5">
        <Row
          id="doc-notif-messages"
          title="Patient messages"
          description="When a patient sends a chat message for an appointment."
          checked={prefs.inAppMessages}
          onChange={(v) => update("inAppMessages", v)}
        />
        <Row
          id="doc-notif-appointments"
          title="Appointments"
          description="Booking requests, confirmations, cancellations, and schedule changes."
          checked={prefs.inAppAppointments}
          onChange={(v) => update("inAppAppointments", v)}
        />
        <Row
          id="doc-notif-system"
          title="System"
          description="Important account and practice alerts."
          checked={prefs.inAppSystem}
          onChange={(v) => update("inAppSystem", v)}
        />
      </div>

      {savedFlash ? (
        <p className="text-sm font-semibold text-emerald-700">
          Preferences saved on this device.
        </p>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-slate-50/80 px-5 py-4">
        <p className="text-sm font-extrabold text-slate-900">Your inbox</p>
        <p className="mt-1 text-xs font-semibold text-slate-600">
          Open the full list to mark items read or jump to chat.
        </p>
        <Link
          to="/doctor/notifications"
          className="mt-3 inline-flex h-10 items-center rounded-xl bg-[#007E85] px-4 text-sm font-extrabold text-white hover:bg-[#006970]"
        >
          View all notifications
        </Link>
      </div>
    </div>
  );
}
