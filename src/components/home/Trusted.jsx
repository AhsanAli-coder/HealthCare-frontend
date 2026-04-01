function Brand({ children, className = "" }) {
  return (
    <span
      className={`select-none text-2xl font-semibold tracking-tight text-slate-600 sm:text-3xl ${className}`}
    >
      {children}
    </span>
  );
}

function Trusted() {
  return (
    <section className="bg-hero-bg py-12 md:py-14 border-y border-slate-200/70">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center font-hero text-2xl font-bold text-[#007E85] sm:text-3xl">
          Trusted by 10,000+ companies around the world
        </h2>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-14 gap-y-6 sm:gap-x-16">
          <Brand>Google</Brand>
          <Brand className="lowercase">facebook</Brand>

          <span className="inline-flex items-center gap-2 text-2xl font-semibold tracking-tight text-slate-600 sm:text-3xl">
            <span
              className="inline-flex h-7 w-10 items-center justify-center rounded-md bg-red-500 text-white sm:h-8 sm:w-11"
              aria-hidden
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                <path d="M10 15V9l6 3-6 3z" />
              </svg>
            </span>
            YouTube
          </span>

          <Brand>Pinterest</Brand>
          <Brand className="font-extrabold">twitch</Brand>
          <Brand className="italic font-bold">webflow</Brand>
        </div>

        <div className="mt-10 flex items-center justify-center gap-3">
          <span className="h-2.5 w-2.5 rounded-full bg-[#007E85]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#007E85]/35" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#007E85]/35" />
        </div>
      </div>
    </section>
  );
}

export default Trusted;
