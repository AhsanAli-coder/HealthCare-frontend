import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";
import { setCredentials } from "../../store/slices/authSlice.js";
import * as userApi from "../../api/userApi.js";

export default function RequireAdmin() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { role, user, isAuthenticated } = useAppSelector((s) => s.auth);

  const [state, setState] = useState({ status: "checking", error: null });

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (isAuthenticated && role === "admin" && user) {
        if (mounted) setState({ status: "ok", error: null });
        return;
      }

      try {
        const me = await userApi.getMe();
        const currentUser = me?.data ?? me;
        if (!currentUser || currentUser.role !== "admin") {
          throw new Error("Not an admin");
        }
        dispatch(
          setCredentials({
            user: currentUser,
            role: "admin",
          }),
        );
        if (mounted) setState({ status: "ok", error: null });
      } catch (e) {
        if (mounted) setState({ status: "blocked", error: e });
      }
    }

    run();
    return () => {
      mounted = false;
    };
  }, [dispatch, isAuthenticated, role, user]);

  if (state.status === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#007E85]" />
          <p className="mt-4 text-sm font-semibold text-slate-700">
            Verifying admin session…
          </p>
        </div>
      </div>
    );
  }

  if (state.status === "blocked") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
