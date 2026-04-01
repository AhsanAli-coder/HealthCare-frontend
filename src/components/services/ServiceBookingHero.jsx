import { useMemo, useState } from "react";

const BG_SRC = encodeURI(
  "/servicesPage/29a183e94cfaa1c70f9923b9dff53e831733a031.jpg",
);

const DEPARTMENTS = [
  "Dental",
  "Orthopedic",
  "Cardiology",
  "Surgery",
  "Eye care",
  "General",
];

const TIMES = ["4:00 Available", "5:00 Available", "6:00 Available"];

function FieldLabel({ children }) {
  return (
    <span className="text-xs font-semibold text-slate-700">{children}</span>
  );
}

function ServiceBookingHero() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [time, setTime] = useState("");

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);

  function onSubmit(e) {
    e.preventDefault();
    // UI-only for now.
    setName("");
    setEmail("");
    setDepartment("");
    setTime("");
  }

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundImage: `url(${BG_SRC})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Softer overlay + left bias so the hospital photo reads like Figma */}
      <div className="absolute inset-0 bg-black/20" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/15 to-black/5"
        aria-hidden
      />

      <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className="max-w-xl">
          <h1 className="font-hero text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Meet the Best
            <br />
            Hospital
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
            We know how large objects will act,
            <br />
            but things on a small scale.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="rounded-full bg-[#007E85] px-7 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#006970] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get Quote Now
            </button>
            <button
              type="button"
              className="rounded-full border-2 border-white/70 bg-white/0 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Learn More
            </button>
          </div>
        </div>

        <div className="lg:justify-self-end lg:pr-1">
          <form
            onSubmit={onSubmit}
            className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl shadow-slate-900/20 ring-1 ring-slate-200/70 lg:translate-y-1"
          >
            <h2 className="text-center text-xl font-bold text-slate-900">
              Book Appointment
            </h2>

            <div className="mt-6 space-y-4">
              <label className="block">
                <FieldLabel>Name *</FieldLabel>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name *"
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
                  required
                />
              </label>

              <label className="block">
                <FieldLabel>Email address *</FieldLabel>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
                  required
                />
              </label>

              <label className="block">
                <FieldLabel>Department *</FieldLabel>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
                  required
                >
                  <option value="" disabled>
                    Please Select
                  </option>
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <FieldLabel>Time *</FieldLabel>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
                  required
                >
                  <option value="" disabled>
                    Select time
                  </option>
                  {TIMES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block">
                <FieldLabel>Date</FieldLabel>
                <input
                  type="date"
                  min={today}
                  className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
                />
              </label>
            </div>

            <button
              type="submit"
              className="mt-7 h-11 w-full rounded-lg bg-[#007E85] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#006970] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007E85]"
            >
              Book Appointment
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default ServiceBookingHero;

