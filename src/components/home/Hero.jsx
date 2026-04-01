import Button from "../ui/Button.jsx";

const BLOB_SRC = encodeURI("/Vector (1).svg");
const DOCTOR_SRC = "/doctor.png";

/** Dark navy for card labels (matches design) */
const NAVY = "#1a2b45";

const HERO_SUBTEXT =
  "At Our Hospital, We Are Dedicated To Providing Exceptional Medical Care To Our Patients And Their Families. Our Experienced Team Of Medical Professionals, Cutting-Edge Technology, And Compassionate Approach Make Us A Leader In The Healthcare Industry";

function HeroVisual() {
  return (
    <div className="relative mx-auto flex min-h-[420px] w-full max-w-[580px] justify-center sm:min-h-[480px] lg:max-w-[640px] lg:min-h-[520px]">
      {/* Blob: slightly larger than doctor to frame him */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 z-0 w-[92%] max-w-[460px] -translate-x-1/2 sm:w-[94%] sm:max-w-[500px] lg:w-[96%] lg:max-w-[540px]"
        aria-hidden
      >
        <img
          src={BLOB_SRC}
          alt=""
          className="mx-auto h-auto w-full max-h-[min(440px,72vh)] object-contain object-bottom sm:max-h-[min(480px,76vh)] lg:max-h-[min(520px,78vh)]"
          width={520}
          height={548}
        />
      </div>

      <img
        src={DOCTOR_SRC}
        alt="Healthcare professional"
        className="relative z-10 max-h-[440px] w-auto max-w-[88%] object-contain object-bottom sm:max-h-[500px] lg:max-h-[540px] xl:max-h-[580px]"
        width={480}
        height={640}
        decoding="async"
      />

      <div className="absolute right-0 top-[5%] z-20 w-max max-w-[calc(100%-1rem)] rounded-2xl bg-white px-4 py-3 shadow-lg shadow-slate-900/10 sm:right-1 sm:top-[7%] md:px-5 md:py-3.5">
        <p className="text-sm font-semibold md:text-base" style={{ color: NAVY }}>
          <span className="font-bold text-[#007E85]">24/7</span>{" "}
          <span className="font-semibold">Service</span>
        </p>
      </div>

      <div className="absolute bottom-[8%] left-0 z-20 w-max max-w-[min(100%,280px)] rounded-2xl bg-white px-4 py-3 shadow-lg shadow-slate-900/10 sm:bottom-[10%] sm:left-1 md:px-5 md:py-3.5">
        <p
          className="text-sm font-bold md:text-base"
          style={{ color: NAVY }}
        >
          Our Professionals
        </p>
        <div className="mt-2.5 flex items-center pl-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className="-ml-2 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-white bg-sky-100 text-slate-500 first:ml-0"
              aria-hidden
            >
              <svg
                className="h-4 w-4 text-slate-500"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </span>
          ))}
          <span
            className="-ml-2 inline-flex h-9 min-w-[2.25rem] shrink-0 items-center justify-center rounded-full border-2 border-white bg-[#007E85] px-1.5 text-[10px] font-bold leading-none text-white sm:text-[11px]"
            aria-hidden
          >
            +30
          </span>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="overflow-hidden bg-hero-bg pb-12 pt-10 md:pb-16 md:pt-14">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:gap-x-20 lg:gap-y-12 xl:gap-x-28">
        <div className="max-w-xl text-left lg:max-w-[540px] lg:pr-4">
          <h1 className="font-hero text-4xl font-bold leading-[1.2] tracking-tight text-[#1a2b45] sm:text-5xl lg:text-[2.6rem] xl:text-[2.8rem]">
            <span>Providing Quality </span>
            <span className="text-[#007E85]">Healthcare</span>
            <span> For A </span>
            <span className="text-brand-green">Brighter And Healthy</span>
            <span> Future</span>
          </h1>
          <p className="mt-8 max-w-xl text-base font-normal leading-[1.75] text-[#5c6e82] sm:text-lg">
            {HERO_SUBTEXT}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <Button variant="primary" className="px-8 py-3 text-base font-bold">
              Appointments
            </Button>
            <button
              type="button"
              className="group inline-flex items-center gap-3 rounded-lg bg-transparent text-base font-semibold text-[#1a2b45] transition-colors hover:text-[#0f1a2e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007E85]"
            >
              <span
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#007E85] text-white shadow-md transition-transform group-hover:scale-105"
                aria-hidden
              >
                <svg
                  className="ml-0.5 h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              Watch Video
            </button>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end lg:pl-4">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

export default Hero;
