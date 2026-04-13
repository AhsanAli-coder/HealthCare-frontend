import { Link } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks.js";
import { useDashboardNotifications } from "../../../context/DashboardNotificationContext.jsx";

function IconButton({ children, label }) {
  return (
    <button
      type="button"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      aria-label={label}
    >
      {children}
    </button>
  );
}

function initialsFromName(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (a + b).toUpperCase() || "?";
}

function DoctorTopbar({ title = "Welcome, Doctor", subtitle = "" }) {
  const { unreadCount } = useDashboardNotifications();
  const { user } = useAppSelector((s) => s.auth);
  const photoUrl = user?.profilePhoto?.trim() ? user.profilePhoto : null;
  const displayTitle = title || user?.name || "Doctor";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="flex h-20 w-full items-center justify-end gap-3 px-6">
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <IconButton label="Help">
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
                d="M12 18h.01M9.09 9a3 3 0 1 1 4.24 2.67c-.64.23-1.33.88-1.33 1.83V15"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
              />
            </svg>
          </IconButton>
          <Link
            to="/doctor/notifications"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
                d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.17V11a6 6 0 1 0-12 0v3.17c0 .53-.21 1.04-.59 1.41L4 17h5"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17a3 3 0 0 0 6 0"
              />
            </svg>
            {unreadCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#007E85] px-0.5 text-[9px] font-extrabold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            ) : null}
          </Link>

          <Link
            to="/doctor/settings"
            className="ml-1 flex min-w-0 max-w-[min(100%,18rem)] items-center gap-3 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-3 transition hover:bg-slate-50"
          >
            {photoUrl ? (
              <img
                src={photoUrl}
                alt=""
                className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-slate-100"
              />
            ) : (
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#007E85]/15 text-[11px] font-extrabold text-[#007E85] ring-2 ring-slate-100"
                aria-hidden
              >
                {initialsFromName(user?.name)}
              </span>
            )}
            <div className="min-w-0 hidden text-left sm:block">
              <p className="truncate text-sm font-bold text-slate-900">
                {displayTitle}
              </p>
              {subtitle ? (
                <p className="truncate text-xs text-slate-500">{subtitle}</p>
              ) : null}
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default DoctorTopbar;
