import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.js";
import { logoutThunk } from "../../../store/slices/authSlice.js";

export default function AdminTopbar() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  async function onLogout() {
    await dispatch(logoutThunk());
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6">
      <p className="text-sm font-semibold text-slate-600">
        Signed in as{" "}
        <span className="font-extrabold text-slate-900">
          {user?.name ?? "Admin"}
        </span>
      </p>
      <button
        type="button"
        onClick={onLogout}
        className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-sm font-extrabold text-slate-700 hover:bg-slate-50"
      >
        Log out
      </button>
    </header>
  );
}
