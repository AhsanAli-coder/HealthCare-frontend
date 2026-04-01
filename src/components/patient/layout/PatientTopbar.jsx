import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.js";
import { logoutThunk } from "../../../store/slices/authSlice.js";

export default function PatientTopbar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((s) => s.auth);

  return (
    <header className="sticky top-0 z-20 w-full border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <div className="text-lg font-extrabold text-slate-900">Overview</div>
          <div className="text-xs font-semibold text-slate-500">
            Welcome{user?.name ? `, ${user.name}` : ""}.
          </div>
        </div>

        <div className="flex items-center gap-3">
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

