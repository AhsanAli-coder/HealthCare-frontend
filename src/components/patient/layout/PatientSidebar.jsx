import { NavLink } from "react-router-dom";

const nav = [
  { to: "/patient/overview", label: "Overview" },
  { to: "/patient/appointments", label: "Appointments" },
  { to: "/patient/doctors", label: "Doctors" },
  { to: "/patient/messages", label: "Messages" },
  { to: "/patient/notifications", label: "Notifications" },
  { to: "/patient/documents", label: "Documents" },
  { to: "/patient/reviews", label: "Reviews" },
  { to: "/patient/settings", label: "Settings" },
];

function linkClass({ isActive }) {
  return [
    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition",
    isActive
      ? "bg-[#007E85] text-white shadow-sm"
      : "text-slate-700 hover:bg-slate-100",
  ].join(" ");
}

export default function PatientSidebar() {
  return (
    <aside className="sticky top-0 h-screen w-[280px] shrink-0 border-r border-slate-200 bg-white">
      <div className="px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#007E85] text-white">
            P
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-slate-900">Patient</div>
            <div className="text-xs font-semibold text-slate-500">
              Dashboard
            </div>
          </div>
        </div>
      </div>

      <nav className="px-3 pb-6">
        <div className="space-y-1">
          {nav.map((i) => (
            <NavLink key={i.to} to={i.to} className={linkClass} end>
              <span>{i.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  );
}

