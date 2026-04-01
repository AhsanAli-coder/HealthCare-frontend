import { useState } from "react";

function Subscribe() {
  const [email, setEmail] = useState("");

  function onSubmit(e) {
    e.preventDefault();
    // Hook to API later; keep UI-only for now.
    setEmail("");
  }

  return (
    <section className="bg-hero-bg py-14 md:py-16">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <h2 className="text-center font-hero text-2xl font-bold text-slate-800 sm:text-3xl">
          Subscribe to our newsletter
        </h2>

        <form
          onSubmit={onSubmit}
          className="mx-auto mt-8 flex w-full max-w-2xl flex-col items-stretch gap-4 sm:flex-row sm:items-center sm:gap-5"
        >
          <label className="sr-only" htmlFor="newsletter-email">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-12 flex-1 rounded-full border border-slate-200 bg-white px-6 text-sm text-slate-800 placeholder:text-slate-400 shadow-sm shadow-slate-900/5 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20"
          />

          <button
            type="submit"
            className="h-12 rounded-full bg-[#007E85] px-8 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#006970] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007E85]"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

export default Subscribe;
