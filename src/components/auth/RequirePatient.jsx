import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";
import { setCredentials } from "../../store/slices/authSlice.js";
import * as patientApi from "../../api/patientApi.js";

function RequirePatient() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { role, user, isAuthenticated } = useAppSelector((s) => s.auth);

  const [state, setState] = useState({ status: "checking", error: null });

  useEffect(() => {
    let mounted = true;

    async function run() {
      // If redux already says patient, allow immediately.
      if (isAuthenticated && role === "patient" && user) {
        if (mounted) setState({ status: "ok", error: null });
        return;
      }

      // No /patients/me endpoint in your list, so we verify session by hitting
      // a patient-only endpoint. If it succeeds, user is authenticated as patient.
      try {
        const data = await patientApi.getMyAppointments();
        dispatch(
          setCredentials({
            user: user ?? { role: "patient" },
            role: "patient",
          }),
        );
        if (mounted) setState({ status: "ok", error: null });
        return data;
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
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-24 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#007E85]" />
          <p className="mt-4 text-sm font-semibold text-slate-700">
            Checking your session…
          </p>
          <p className="mt-2 text-xs text-slate-500">Please wait a moment.</p>
        </div>
      </div>
    );
  }
  if (state.status === "blocked") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
export default RequirePatient;

