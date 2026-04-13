import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DoctorTopbar from "../../components/doctor/layout/DoctorTopbar.jsx";
import DoctorProfileEditor from "../../components/doctor/DoctorProfileEditor.jsx";
import ChangePasswordPanel from "../../components/settings/ChangePasswordPanel.jsx";
import ProfilePhotoSettingsPanel from "../../components/settings/ProfilePhotoSettingsPanel.jsx";
import TimezoneSettingsPanel from "../../components/settings/TimezoneSettingsPanel.jsx";
import DoctorNotificationSettingsPanel from "../../components/settings/DoctorNotificationSettingsPanel.jsx";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";
import { logoutThunk } from "../../store/slices/authSlice.js";
import {
  getDoctorReviewsList,
  mapReviewToCardItem,
} from "../../api/reviewApi.js";

const TABS = [
  "My Profile",
  "Timezone",
  "Change Password",
  "Notification",
  "Reviews",
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

function initialsFromName(name) {
  if (!name || typeof name !== "string") return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1][0] : parts[0]?.[1] ?? "";
  return (a + b).toUpperCase() || "?";
}

function ReviewCard({ item }) {
  return (
    <div className="rounded-2xl bg-white px-6 py-5 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-3">
          {item.profilePhoto ? (
            <img
              src={item.profilePhoto}
              alt=""
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#007E85]/15 text-xs font-extrabold text-[#007E85]"
              aria-hidden
            >
              {initialsFromName(item.name)}
            </span>
          )}
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
  const { user } = useAppSelector((s) => s.auth);
  const [profileDoc, setProfileDoc] = useState(null);
  const [activeTab, setActiveTab] = useState("My Profile");
  const [reviews, setReviews] = useState([]);
  const [reviewsStatus, setReviewsStatus] = useState("idle");
  const [reviewsError, setReviewsError] = useState(null);

  const displayName = useMemo(() => {
    const n = user?.name;
    if (n) return n.startsWith("Dr.") ? n : `Dr. ${n}`;
    const u = profileDoc?.userId;
    if (typeof u === "object" && u?.name) {
      return u.name.startsWith("Dr.") ? u.name : `Dr. ${u.name}`;
    }
    return "Doctor";
  }, [user?.name, profileDoc]);

  const tabUnderline = useMemo(() => {
    const idx = TABS.indexOf(activeTab);
    return {
      transform: `translateX(${idx * 100}%)`,
      width: `${100 / TABS.length}%`,
    };
  }, [activeTab]);

  const doctorId = user?.doctorProfileId ?? profileDoc?._id ?? null;

  const reviewCount = profileDoc?.totalReviews ?? 0;
  const avgRating = profileDoc?.averageRating;

  useEffect(() => {
    if (activeTab !== "Reviews" || !doctorId) return;
    let alive = true;
    setReviewsStatus("loading");
    setReviewsError(null);
    getDoctorReviewsList(doctorId)
      .then((rows) => {
        if (!alive) return;
        setReviews(rows);
        setReviewsStatus("ok");
      })
      .catch((e) => {
        if (!alive) return;
        setReviews([]);
        setReviewsStatus("error");
        setReviewsError(
          e?.data?.message ?? e?.message ?? "Could not load reviews",
        );
      });
    return () => {
      alive = false;
    };
  }, [activeTab, doctorId]);

  const listSummary = useMemo(() => {
    if (!reviews.length) return { count: 0, avg: null };
    const sum = reviews.reduce((s, r) => s + (Number(r.rating) || 0), 0);
    return { count: reviews.length, avg: sum / reviews.length };
  }, [reviews]);

  async function handleLogout() {
    await dispatch(logoutThunk());
    navigate("/login", { replace: true });
  }

  return (
    <>
      <DoctorTopbar
        title={displayName}
        subtitle={profileDoc?.specialization ?? "Doctor profile"}
      />

      <div className="px-6 py-8">
        <div className="mx-auto max-w-[1200px]">
          <h1 className="text-lg font-extrabold text-slate-900">My Profile</h1>

          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            {/* Left profile card */}
            <section className="rounded-2xl bg-white px-6 py-7 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70 lg:col-span-4">
              <div className="flex flex-col items-center text-center">
                <ProfilePhotoSettingsPanel layout="inline" />
                <p className="mt-4 text-base font-extrabold text-slate-900">
                  {displayName}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  {profileDoc?.specialization ?? "—"}
                </p>

                <button
                  type="button"
                  onClick={() => setActiveTab("My Profile")}
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
                  Edit profile &amp; bio
                </button>

                <div className="mt-7 w-full rounded-xl bg-slate-50 px-4 py-4 text-left">
                  <p className="text-xs font-bold text-slate-500">
                    {reviewCount} reviews
                  </p>
                  <div className="mt-2">
                    <StarRow
                      count={Math.min(
                        5,
                        Math.max(
                          0,
                          Math.round(Number(avgRating) || 0),
                        ),
                      )}
                    />
                  </div>
                  <p className="mt-2 text-xs font-semibold text-slate-600">
                    Avg ★{" "}
                    {avgRating != null && !Number.isNaN(Number(avgRating))
                      ? Number(avgRating).toFixed(1)
                      : "—"}
                  </p>
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

              {activeTab === "My Profile" ? (
                <div className="mt-6">
                  <DoctorProfileEditor onProfileLoaded={setProfileDoc} />
                </div>
              ) : activeTab === "Timezone" ? (
                <div className="mt-6">
                  <TimezoneSettingsPanel title="Your timezone" />
                </div>
              ) : activeTab === "Reviews" ? (
                <div className="mt-6 space-y-4">
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">
                      Reviews
                    </h2>
                    <p className="mt-1 text-xs font-semibold text-slate-500">
                      Ratings from patients after completed appointments.
                    </p>
                  </div>

                  {!doctorId ? (
                    <p className="text-sm font-semibold text-slate-500">
                      Load your profile first (open My Profile), then return
                      here.
                    </p>
                  ) : reviewsStatus === "loading" ? (
                    <p className="text-sm font-semibold text-slate-600">
                      Loading reviews…
                    </p>
                  ) : reviewsStatus === "error" ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
                      {reviewsError}
                    </div>
                  ) : (
                    <>
                      <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm font-semibold text-slate-700">
                        <span className="text-[#007E85]">
                          {listSummary.count}
                        </span>{" "}
                        ratings
                        {listSummary.avg != null ? (
                          <>
                            {" "}
                            · average{" "}
                            <span className="text-[#007E85]">
                              {listSummary.avg.toFixed(1)}
                            </span>{" "}
                            / 5
                          </>
                        ) : null}
                      </div>
                      {reviews.length === 0 ? (
                        <p className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-8 text-center text-sm font-semibold text-slate-600">
                          No reviews yet. When patients complete appointments
                          and submit feedback, it will show here.
                        </p>
                      ) : (
                        reviews.map((r) => (
                          <ReviewCard
                            key={String(r._id)}
                            item={mapReviewToCardItem(r)}
                          />
                        ))
                      )}
                    </>
                  )}
                </div>
              ) : activeTab === "Change Password" ? (
                <div className="mt-6">
                  <ChangePasswordPanel />
                </div>
              ) : activeTab === "Notification" ? (
                <div className="mt-6">
                  <DoctorNotificationSettingsPanel />
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

