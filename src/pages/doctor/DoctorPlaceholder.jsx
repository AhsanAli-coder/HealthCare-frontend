import DoctorTopbar from "../../components/doctor/layout/DoctorTopbar.jsx";

function DoctorPlaceholder({ title }) {
  return (
    <>
      <DoctorTopbar title={title} subtitle="This section is not connected yet" />
      <div className="mx-auto max-w-[1200px] px-6 py-10">
        <div className="rounded-2xl bg-white p-8 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
          <h1 className="font-hero text-2xl font-bold text-slate-900">
            {title}
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            This page will be wired to your backend APIs next.
          </p>
        </div>
      </div>
    </>
  );
}

export default DoctorPlaceholder;

