import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.js";
import { logoutThunk } from "../../../store/slices/authSlice.js";
import { useDashboardNotifications } from "../../../context/DashboardNotificationContext.jsx";

const titles = {
  "/patient/overview": "Overview",
  "/patient/appointments": "Appointments",
  "/patient/doctors": "Doctors",
  "/patient/messages": "Messages",
  "/patient/documents": "Documents",
  "/patient/reviews": "Reviews",
  "/patient/settings": "Settings",
  "/patient/notifications": "Notifications",
};

function titleForPath(pathname) {
  if (titles[pathname]) return titles[pathname];
  if (pathname.startsWith("/patient/doctors/")) return "Doctor";
  if (pathname.startsWith("/patient/prescriptions/")) return "Prescription";
  return "Dashboard";
}

export default function PatientTopbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);
  const { unreadCount } = useDashboardNotifications();

  const title = titleForPath(location.pathname);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <div className="text-lg font-extrabold text-slate-900">{title}</div>
          <div className="text-xs font-semibold text-slate-500">
            Welcome{user?.name ? `, ${user.name}` : ""}.
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/patient/notifications"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
          >
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {unreadCount > 0 ? (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#007E85] px-1 text-[10px] font-extrabold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            onClick={async () => {
              await dispatch(logoutThunk());
              navigate("/login");
            }}
          >
            Logout
          </button>
          <div className="h-10 w-10 rounded-2xl bg-slate-100" />
        </div>
      </div>
    </header>
  );
}
