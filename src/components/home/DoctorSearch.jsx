import Button from "../ui/Button.jsx";
import Toggle from "../ui/Toggle.jsx";
import {
  setDoctorSearchAvailableOnly,
  setDoctorSearchName,
  setDoctorSearchSpeciality,
  submitDoctorSearch,
} from "../../store/slices/doctorSearchSlice.js";
import { useAppDispatch, useAppSelector } from "../../store/hooks.js";

/**
 * FR-003: Doctor discovery filters — state in Redux for upcoming API calls.
 */
function DoctorSearch() {
  const dispatch = useAppDispatch();
  const { name, speciality, availableOnly } = useAppSelector(
    (s) => s.doctorSearch,
  );

  function handleSubmit(e) {
    e.preventDefault();
    dispatch(submitDoctorSearch());
  }

  return (
    <section className="relative z-10 mx-auto -mt-10 max-w-5xl px-6 pb-8">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-lg shadow-slate-200/80 md:p-8"
      >
        <h2 className="text-xl font-bold text-slate-900 md:text-2xl">
          Find A Doctor
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Search by name, specialization, and availability.
        </p>

        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-6">
          <div className="flex-1 space-y-4 sm:flex sm:gap-4 sm:space-y-0">
            <label className="block flex-1">
              <span className="sr-only">Name</span>
              <input
                type="text"
                placeholder="Doctor name"
                value={name}
                onChange={(e) => dispatch(setDoctorSearchName(e.target.value))}
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
              />
            </label>
            <label className="block flex-1">
              <span className="sr-only">Speciality</span>
              <input
                type="text"
                placeholder="Specialization"
                value={speciality}
                onChange={(e) =>
                  dispatch(setDoctorSearchSpeciality(e.target.value))
                }
                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 lg:justify-end">
            <Toggle
              id="doctor-available"
              label="Available"
              checked={availableOnly}
              onChange={(v) => dispatch(setDoctorSearchAvailableOnly(v))}
            />
            <Button type="submit" className="min-w-[120px] lg:shrink-0">
              Search
            </Button>
          </div>
        </div>
      </form>
    </section>
  );
}

export default DoctorSearch;
