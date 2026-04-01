import DoctorTopbar from "../../components/doctor/layout/DoctorTopbar.jsx";

function StatCard({ color, title, value, icon }) {
  return (
    <div
      className="flex items-center justify-between rounded-2xl px-6 py-5 text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      <div>
        <p className="text-2xl font-extrabold leading-none">{value}</p>
        <p className="mt-1 text-sm font-semibold text-white/90">{title}</p>
      </div>
      <div className="rounded-xl bg-white/20 p-3">{icon}</div>
    </div>
  );
}

function MiniStat({ value, label, delta }) {
  return (
    <div className="rounded-2xl bg-white px-6 py-5 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
      <p className="text-xl font-extrabold text-slate-900">{value}</p>
      <p className="mt-1 text-sm font-semibold text-slate-500">{label}</p>
      {delta ? (
        <p className="mt-2 text-xs font-semibold text-emerald-600">{delta}</p>
      ) : null}
    </div>
  );
}

function AppointmentRequestRow({ name, meta, status }) {
  const badge =
    status === "Confirmed"
      ? "bg-blue-50 text-blue-700 ring-blue-200"
      : "bg-red-50 text-red-700 ring-red-200";
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 rounded-full bg-slate-200" aria-hidden />
        <div>
          <p className="text-sm font-bold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{meta}</p>
        </div>
      </div>
      <span
        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${badge}`}
      >
        {status}
      </span>
    </div>
  );
}

function TodayRow({ name, type, time, chip }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3">
        <span className="h-10 w-10 rounded-full bg-slate-200" aria-hidden />
        <div>
          <p className="text-sm font-bold text-slate-900">{name}</p>
          <p className="text-xs text-slate-500">{type}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-xs font-semibold text-slate-500">{time}</p>
        <span className="mt-1 inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-600">
          {chip}
        </span>
      </div>
    </div>
  );
}

function DoctorOverview() {
  return (
    <>
      <DoctorTopbar title="Stephen Conley" subtitle="Cardiologist" />

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-extrabold text-slate-900">
            Welcome, Dr. Stephen
          </h1>
          <p className="text-sm text-slate-500">Have a nice day at great work</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            color="#6D63FF"
            value="24.4k"
            title="Appointments"
            icon={
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 2v2H5a2 2 0 0 0-2 2v2h18V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2H7zm14 8H3v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10z" />
              </svg>
            }
          />
          <StatCard
            color="#FF5C7A"
            value="166.3k"
            title="Total Patient"
            icon={
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.33 0-8 1.67-8 5v1h16v-1c0-3.33-4.67-5-8-5z" />
              </svg>
            }
          />
          <StatCard
            color="#FFA200"
            value="53.5k"
            title="Clinic Consulting"
            icon={
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h10v10H7V7zm-2 0a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7z" />
              </svg>
            }
          />
          <StatCard
            color="#2D9CFF"
            value="28.0k"
            title="Video Consulting"
            icon={
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15 10.5V7a2 2 0 0 0-2-2H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l6 4v-11l-6 4z" />
              </svg>
            }
          />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          <section className="rounded-2xl bg-white px-6 py-5 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70 lg:col-span-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">
                Appointment Request
              </h2>
              <button
                type="button"
                className="text-xs font-bold text-[#007E85] hover:opacity-80"
              >
                View All →
              </button>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              <AppointmentRequestRow
                name="Bogdan Krivenchenko"
                meta="45 Male, 12 April 9:30"
                status="Declined"
              />
              <AppointmentRequestRow
                name="Jenny Wilson"
                meta="Female, 25 April 10:30 AM"
                status="Confirmed"
              />
              <AppointmentRequestRow
                name="Dianne Russel"
                meta="Male, 45 Today 14:30 PM"
                status="Confirmed"
              />
              <AppointmentRequestRow
                name="Annette Black"
                meta="Male, 45 Today 14:30 PM"
                status="Declined"
              />
            </div>
          </section>

          <div className="grid gap-6 lg:col-span-3">
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Patients
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  2020
                </span>
              </div>
              <div className="grid gap-4">
                <MiniStat value="24.4k" label="New Patient" delta="+15%" />
                <MiniStat value="166.3k" label="Old Patient" delta="+15%" />
              </div>
            </section>

            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Gender
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  2020
                </span>
              </div>
              <div className="rounded-2xl bg-white px-6 py-5 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
                <div className="mx-auto h-28 w-28 rounded-full border-8 border-slate-100">
                  <div className="h-full w-full rounded-full border-8 border-[#6D63FF]/70" />
                </div>
                <div className="mt-4 flex justify-around text-xs font-semibold text-slate-600">
                  <span>Male 45%</span>
                  <span>Female 30%</span>
                  <span>Child 25%</span>
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-2xl bg-white px-6 py-5 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70 lg:col-span-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-extrabold text-slate-900">
                Today Appointments
              </h2>
              <span className="text-xs font-semibold text-slate-500">Today</span>
            </div>
            <div className="mt-4 divide-y divide-slate-100">
              <TodayRow
                name="Jhon Smith"
                type="Clinic Consulting"
                time="Ongoing"
                chip="Ongoing"
              />
              <TodayRow
                name="Frank Murray"
                type="Video Consulting"
                time="10:25"
                chip="10:25"
              />
              <TodayRow
                name="Ella Lucia"
                type="Emergency"
                time="11:30"
                chip="11:30"
              />
            </div>
            <div className="mt-6 rounded-2xl bg-slate-900 px-5 py-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-white/80">
                    Next Week
                  </p>
                  <p className="mt-1 text-sm font-bold">
                    Upcoming Schedules - 2
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-xl bg-[#6D63FF] px-4 py-2 text-xs font-bold"
                >
                  Open
                </button>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-2xl bg-white px-6 py-5 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900">
              Recent Patients
            </h2>
            <button
              type="button"
              className="text-xs font-bold text-[#007E85] hover:opacity-80"
            >
              View All →
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-xs font-bold text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="py-3 pr-6">Patient Name</th>
                  <th className="py-3 pr-6">Visit Id</th>
                  <th className="py-3 pr-6">Date</th>
                  <th className="py-3 pr-6">Gender</th>
                  <th className="py-3 pr-6">Diseases</th>
                  <th className="py-3 pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  ["Deveon Lane", "OPD-2345", "5/7/21", "Male", "Diabetes", "Out-Patient"],
                  ["Albert Flores", "IPD-2424", "5/7/21", "Male", "Diabetes", "Out-Patient"],
                  ["Ella Lucia", "OPD-2345", "8/15/21", "Male", "Diabetes", "Out-Patient"],
                ].map((row) => (
                  <tr key={row[1]} className="text-slate-700">
                    <td className="py-3 pr-6 font-semibold">{row[0]}</td>
                    <td className="py-3 pr-6">{row[1]}</td>
                    <td className="py-3 pr-6">{row[2]}</td>
                    <td className="py-3 pr-6">{row[3]}</td>
                    <td className="py-3 pr-6">{row[4]}</td>
                    <td className="py-3 pr-2 text-slate-500">{row[5]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

export default DoctorOverview;

