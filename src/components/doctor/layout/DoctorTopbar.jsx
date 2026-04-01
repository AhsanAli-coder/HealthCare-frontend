import { useState } from "react";

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

function DoctorTopbar({ title = "Welcome, Doctor", subtitle = "" }) {
  const [query, setQuery] = useState("");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
      <div className="flex h-20 w-full items-center gap-5 px-6">
        <div className="hidden flex-1 lg:block">
          <div className="relative max-w-lg">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0z"
                />
              </svg>
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Appointment, Patient or etc"
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
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
          <IconButton label="Notifications">
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
          </IconButton>

          <div className="ml-2 flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-1.5">
            <span className="h-8 w-8 rounded-full bg-slate-200" aria-hidden />
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-900">{title}</p>
              {subtitle ? (
                <p className="text-xs text-slate-500">{subtitle}</p>
              ) : null}
            </div>
            <svg
              className="h-4 w-4 text-slate-500"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6 9 6 6 6-6"
              />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}

export default DoctorTopbar;

