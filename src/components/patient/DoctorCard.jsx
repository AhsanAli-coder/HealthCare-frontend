import { Link } from "react-router-dom";

function StarRow({ value }) {
  const n = Math.min(5, Math.max(0, Number(value) || 0));
  return (
    <div className="flex items-center gap-0.5 text-amber-400" aria-label={`Rating ${n} of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>{i < Math.round(n) ? "★" : "☆"}</span>
      ))}
    </div>
  );
}

export default function DoctorCard({ doctor }) {
  const id = doctor?._id;
  if (!id) return null;
  const user = doctor?.userId;
  const name =
    typeof user === "object" && user?.name ? user.name : "Doctor";
  const photo =
    typeof user === "object" && user?.profilePhoto ? user.profilePhoto : null;

  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition hover:border-[#007E85]/30">
      <div className="flex gap-4 p-5">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
          {photo ? (
            <img
              src={photo}
              alt=""
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-lg font-extrabold text-slate-400">
              {name.slice(0, 1).toUpperCase()}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-base font-extrabold text-slate-900">
            {name}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-[#007E85]">
            {doctor?.specialization ?? "—"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3 text-xs font-semibold text-slate-500">
            <span>{doctor?.experience ?? 0} yrs exp.</span>
            <span className="text-slate-300">·</span>
            <span>Fee ${doctor?.consultationFee ?? "—"}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <StarRow value={doctor?.averageRating} />
            <span className="text-xs font-bold text-slate-500">
              {Number(doctor?.averageRating ?? 0).toFixed(1)} (
              {doctor?.totalReviews ?? 0})
            </span>
          </div>
        </div>
      </div>
      {doctor?.bio ? (
        <p className="line-clamp-2 px-5 pb-4 text-xs leading-relaxed text-slate-600">
          {doctor.bio}
        </p>
      ) : null}
      <div className="mt-auto border-t border-slate-100 px-5 py-3">
        <Link
          to={`/patient/doctors/${id}`}
          className="text-sm font-extrabold text-[#007E85] hover:underline"
        >
          View profile
        </Link>
      </div>
    </article>
  );
}
