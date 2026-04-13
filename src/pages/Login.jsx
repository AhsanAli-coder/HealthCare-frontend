import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";
import { loginThunk } from "../store/slices/authSlice.js";

function getErrorText(err) {
  if (!err) return null;
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  return "Login failed";
}

function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error, isAuthenticated } = useAppSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
  }, [isAuthenticated, navigate]);

  async function onSubmit(e) {
    e.preventDefault();
    const res = await dispatch(loginThunk({ email, password }));
    const role = res?.payload?.user?.role ?? res?.payload?.user?.userRole;
    if (role === "admin") {
      navigate("/admin/overview", { replace: true });
      return;
    }
    if (role === "doctor") {
      navigate("/doctor/overview", { replace: true });
      return;
    }
    if (role === "patient") {
      navigate("/patient/overview", { replace: true });
      return;
    }
  }

  return (
    <section className="bg-hero-bg py-16 md:py-20">
      <div className="mx-auto max-w-md px-6">
        <h1 className="text-center font-hero text-4xl font-bold text-[#1a2b45]">
          Log In
        </h1>
        <p className="mt-4 text-center text-sm text-[#5c6e82]">
          Sign in to book appointments and manage your care.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-10 rounded-2xl bg-white p-8 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70"
        >
          {getErrorText(error) ? (
            <div className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
              {getErrorText(error)}
            </div>
          ) : null}

          <label className="block">
            <span className="text-xs font-semibold text-slate-700">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test@example.com"
              className="mt-2 h-11 w-full rounded-lg border border-[#007E85]/60 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-semibold text-slate-700">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password123!"
              className="mt-2 h-11 w-full rounded-lg border border-[#007E85]/60 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            />
          </label>

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-6 h-11 w-full rounded-lg bg-[#007E85] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#006970] disabled:opacity-60"
          >
            {status === "loading" ? "Signing in..." : "Log In"}
          </button>

          <p className="mt-6 text-center text-sm text-[#5c6e82]">
            Don’t have an account?{" "}
            <Link to="/signup" className="font-semibold text-[#007E85]">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Login;

