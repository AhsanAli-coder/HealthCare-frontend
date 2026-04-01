import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks.js";
import { registerThunk } from "../store/slices/authSlice.js";

function getErrorText(err) {
  if (!err) return null;
  if (typeof err === "string") return err;
  if (err.message) return err.message;
  return "Registration failed";
}

function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((s) => s.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("patient");

  async function onSubmit(e) {
    e.preventDefault();
    const res = await dispatch(
      registerThunk({ name, email, password, phone, role }),
    );
    if (!res.error) navigate("/", { replace: true });
  }

  return (
    <section className="bg-hero-bg py-16 md:py-20">
      <div className="mx-auto max-w-md px-6">
        <h1 className="text-center font-hero text-4xl font-bold text-[#1a2b45]">
          Sign Up
        </h1>
        <p className="mt-4 text-center text-sm text-[#5c6e82]">
          Create an account as a patient or doctor.
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
            <span className="text-xs font-semibold text-slate-700">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-2 h-11 w-full rounded-lg border border-[#007E85]/60 bg-white px-4 text-sm text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-semibold text-slate-700">Name</span>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Test User"
              className="mt-2 h-11 w-full rounded-lg border border-[#007E85]/60 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            />
          </label>

          <label className="mt-4 block">
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

          <label className="mt-4 block">
            <span className="text-xs font-semibold text-slate-700">Phone</span>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03001234567"
              className="mt-2 h-11 w-full rounded-lg border border-[#007E85]/60 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
            />
          </label>

          <button
            type="submit"
            disabled={status === "loading"}
            className="mt-6 h-11 w-full rounded-lg bg-[#007E85] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#006970] disabled:opacity-60"
          >
            {status === "loading" ? "Creating account..." : "Sign Up"}
          </button>

          <p className="mt-6 text-center text-sm text-[#5c6e82]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[#007E85]">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
}

export default Signup;

