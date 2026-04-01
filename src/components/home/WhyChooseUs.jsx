const PLACEHOLDER_IMG = encodeURI("/Image Placeholder.svg");

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";

function WhyChooseUs() {
  return (
    <section className="bg-hero-bg pb-16 pt-4 md:pb-24 md:pt-8">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="max-w-xl lg:max-w-none">
            <h2 className="font-hero text-3xl font-bold leading-tight text-[#007E85] sm:text-4xl lg:text-[2.25rem] xl:text-4xl">
              You have lots of reasons to choose us
            </h2>
            <p className="mt-6 text-base leading-relaxed text-[#5c6e82] sm:text-lg">
              {LOREM}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                className="rounded-full bg-[#007E85] px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#006970] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007E85]"
              >
                Get started
              </button>
              <button
                type="button"
                className="rounded-full border-2 border-[#007E85] bg-white px-8 py-3 text-base font-semibold text-[#007E85] transition-colors hover:bg-[#007E85]/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007E85]"
              >
                Talk to sales
              </button>
            </div>
          </div>

          <div className="relative lg:justify-self-end">
            <img
              src={PLACEHOLDER_IMG}
              alt="Medical team in the operating room"
              className="w-full max-w-2xl rounded-2xl object-cover shadow-lg shadow-slate-900/10 lg:max-w-none lg:rounded-3xl"
              width={640}
              height={480}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUs;
