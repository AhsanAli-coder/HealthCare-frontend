import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import logo from "../../assets/Frame 2.svg";

const NAV_ITEMS = [
  { to: "/", label: "Home", end: true },
  { to: "/services", label: "Service" },
  { to: "/contact", label: "Contact Us" },
  { to: "/help", label: "Help" },
  { to: "/blogs", label: "Blogs" },
];

function navLinkClass({ isActive }) {
  const base =
    "inline-block border-b-2 pb-1 text-base font-medium transition-colors";
  return isActive
    ? `${base} border-brand-teal text-brand-teal`
    : `${base} border-transparent text-slate-900 hover:text-brand-teal`;
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-slate-50">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8 lg:px-12">
        <Link
          to="/"
          className="flex shrink-0 items-center"
          onClick={() => setMobileOpen(false)}
        >
          <img
            src={logo}
            alt="Healthcare"
            className="h-11 w-auto max-w-[200px] object-contain object-left md:h-12"
          />
        </Link>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-slate-900 hover:bg-slate-200/70 md:hidden"
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="sr-only">Open menu</span>
          {mobileOpen ? (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          )}
        </button>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={navLinkClass}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            to="/signup"
            className="text-base font-semibold text-brand-teal transition-opacity hover:opacity-80"
          >
            Sign Up
          </Link>
          <Link
            to="/login"
            className="rounded-lg bg-brand-teal px-8 py-2 text-base font-bold text-white shadow-sm transition-colors hover:bg-brand-teal-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
          >
            Log In
          </Link>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-nav"
          className="border-t border-slate-200/80 bg-slate-50 px-8 py-4 md:hidden"
        >
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "rounded-md px-1 py-2 text-base font-medium",
                    isActive
                      ? "text-brand-teal"
                      : "text-slate-900 hover:text-brand-teal",
                  ].join(" ")
                }
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-200/80 pt-4">
            <Link
              to="/signup"
              className="text-base font-semibold text-brand-teal"
              onClick={() => setMobileOpen(false)}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="inline-flex w-full items-center justify-center rounded-lg bg-brand-teal px-8 py-2.5 text-base font-bold text-white hover:bg-brand-teal-hover"
              onClick={() => setMobileOpen(false)}
            >
              Log In
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export default Header;
