export default function PatientPlaceholder({ title = "Coming soon" }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="text-lg font-extrabold text-slate-900">{title}</div>
      <p className="mt-2 text-sm font-semibold text-slate-600">
        This section will be implemented next.
      </p>
    </div>
  );
}

