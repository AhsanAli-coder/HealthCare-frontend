import TimezoneSettingsPanel from "../../components/settings/TimezoneSettingsPanel.jsx";

export default function PatientSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm font-semibold text-slate-600">
          Account preferences for your patient dashboard.
        </p>
      </div>
      <TimezoneSettingsPanel title="Your timezone" />
    </div>
  );
}
