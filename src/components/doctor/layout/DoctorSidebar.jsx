import { NavLink } from "react-router-dom";

const ITEMS = [
  { to: "/doctor/overview", label: "Overview" },
  { to: "/doctor/appointments", label: "Appointment" },
  { to: "/doctor/patients", label: "My Patients" },
  { to: "/doctor/schedule", label: "Schedule Timings" },
  { to: "/doctor/payments", label: "Payments" },
  { to: "/doctor/messages", label: "Message" },
  { to: "/doctor/blog", label: "Blog" },
  { to: "/doctor/settings", label: "Settings" },
];

function linkClass({ isActive }) {
  const base =
    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors";
  return isActive
    ? `${base} bg-slate-900 text-white`
    : `${base} text-slate-600 hover:bg-slate-100 hover:text-slate-900`;
}

function DoctorSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-slate-200 bg-white lg:block">
      <div className="flex h-20 items-center px-6">
        <span className="text-lg font-extrabold text-slate-900">Doct.</span>
      </div>
      <nav className="px-3 pb-6" aria-label="Doctor dashboard">
        <div className="space-y-1">
          {ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              <span className="h-2 w-2 rounded-full bg-slate-300" aria-hidden />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}

export default DoctorSidebar;

