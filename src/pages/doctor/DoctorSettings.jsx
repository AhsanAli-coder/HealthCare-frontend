import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorTopbar from "../../components/doctor/layout/DoctorTopbar.jsx";
import TimezoneSettingsPanel from "../../components/settings/TimezoneSettingsPanel.jsx";
import { useAppDispatch } from "../../store/hooks.js";
import { logoutThunk } from "../../store/slices/authSlice.js";

const TABS = [
  "My Profile",
  "Timezone",
  "Change Password",
  "Notification",
  "Reviews",
];

const REVIEWS = [
  {
    name: "Ronald Richards",
    role: "Engineer",
    date: "8 Jun, 2021",
    text:
      "Thank you to Dr. Stephen Conley and staff for a great experience right from the start. Everyone made me feel comfortable and the outcome was great. If you need heart surgery check out Dr. Stephen",
    stars: 5,
  },
  {
    name: "Annette Black",
    role: "Teacher",
    date: "8 Jun, 2021",
    text:
      "Dr. Stephen Conley did a great job on my knee! After my injection I was able to walk again without pain. Before His injection I had 24 hour round the clock pain. Now, I can walk without any discomfort. Thank You Dr. Stephen Conley",
    stars: 5,
  },
  {
    name: "Angelina Jully",
    role: "Teacher",
    date: "8 Jun, 2021",
    text:
      "Excellent cardiologist, my husband and I have both had surgery and ongoing care from him over the years, the medical technology used is state of the art as well, continue to highly recommend.",
    stars: 5,
  },
  {
    name: "Jane Cooper",
    role: "Teacher",
    date: "8 Jun, 2021",
    text:
      "Excellent cardiologist, my husband and I have both had surgery and ongoing care from him over the years, the medical technology used is state of the art as well, continue to highly recommend.",
    stars: 5,
  },
];

function StarRow({ count = 5 }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4 text-amber-400"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ item }) {
  return (
    <div className="rounded-2xl bg-white px-6 py-5 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          <span className="h-11 w-11 rounded-full bg-slate-200" aria-hidden />
          <div>
            <p className="text-sm font-extrabold text-slate-900">{item.name}</p>
            <p className="text-xs text-slate-500">{item.role}</p>
          </div>
        </div>

        <div className="text-right">
          <StarRow count={item.stars} />
          <p className="mt-1 text-xs text-slate-500">{item.date}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[#5c6e82]">{item.text}</p>
    </div>
  );
}

function DoctorSettings() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Timezone");

  const tabUnderline = useMemo(() => {
    const idx = TABS.indexOf(activeTab);
    return {
      transform: `translateX(${idx * 100}%)`,
      width: `${100 / TABS.length}%`,
    };
  }, [activeTab]);

  async function handleLogout() {
    await dispatch(logoutThunk());
    navigate("/login", { replace: true });
  }

  return (
    <>
      <DoctorTopbar title="Stephen Conley" subtitle="Cardiologist" />

      <div className="px-6 py-8">
        <div className="mx-auto max-w-[1200px]">
          <h1 className="text-lg font-extrabold text-slate-900">My Profile</h1>

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            {/* Left profile card */}
            <section className="rounded-2xl bg-white px-6 py-7 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70 lg:col-span-4">
              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 overflow-hidden rounded-full bg-slate-200 ring-8 ring-sky-100" />
                <p className="mt-4 text-base font-extrabold text-slate-900">
                  Dr. Stephen Conley
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Cardiologist
                </p>

                <button
                  type="button"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#6D63FF] px-4 py-2 text-xs font-bold text-white shadow-sm hover:opacity-95"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zM20.71 7.04a1.004 1.004 0 0 0 0-1.42l-2.34-2.34a1.004 1.004 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                  </svg>
                  Edit Profile
                </button>

                <div className="mt-7 w-full rounded-xl bg-slate-50 px-4 py-4 text-left">
                  <p className="text-xs font-bold text-slate-500">146 Rates</p>
                  <div className="mt-2">
                    <StarRow count={5} />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-500">Trust</p>
                    <p className="text-xs font-extrabold text-emerald-600">
                      95%
                    </p>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-emerald-100">
                    <div className="h-2 w-[95%] rounded-full bg-emerald-500" />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-6 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            </section>

            {/* Right tabbed content */}
            <section className="rounded-2xl bg-white px-6 py-6 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70 lg:col-span-8">
              <div className="relative border-b border-slate-200">
                <div className="grid grid-cols-2 gap-2 text-sm font-bold sm:grid-cols-3 lg:grid-cols-5">
                  {TABS.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setActiveTab(t)}
                      className={`pb-3 text-left transition-colors ${
                        activeTab === t
                          ? "text-[#007E85]"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <span
                  className="absolute bottom-0 left-0 h-0.5 bg-[#007E85] transition-transform"
                  style={tabUnderline}
                />
              </div>

              {activeTab === "Timezone" ? (
                <div className="mt-6">
                  <TimezoneSettingsPanel title="Your timezone" />
                </div>
              ) : activeTab === "Reviews" ? (
                <div className="mt-6 space-y-4">
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Reviews
                  </h2>
                  {REVIEWS.map((r, idx) => (
                    <ReviewCard key={idx} item={r} />
                  ))}
                </div>
              ) : (
                <div className="mt-8 rounded-2xl bg-slate-50 px-6 py-10 text-sm text-slate-600">
                  {activeTab} content will be implemented next.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorSettings;

