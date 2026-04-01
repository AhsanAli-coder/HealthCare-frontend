const FAQ_ITEMS = Array.from({ length: 9 }).map((_, idx) => ({
  id: idx,
  title: "the quick fox jumps over the lazy dog",
  desc: "Things on a very small scale behave like nothing",
}));

function FAQCard({ item }) {
  return (
    <div className="rounded-lg bg-white p-5 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-sky-50 text-[#007E85]">
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 18 6-6-6-6" />
          </svg>
        </span>
        <div>
          <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
          <p className="mt-2 text-xs leading-relaxed text-[#5c6e82]">
            {item.desc}
          </p>
        </div>
      </div>
    </div>
  );
}

function FAQ() {
  return (
    <section className="bg-hero-bg py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-hero text-3xl font-bold text-slate-900 sm:text-4xl">
            FAQ
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[#5c6e82] sm:text-base">
            Problems trying to resolve the conflict between the two major realms
            of Classical physics: Newtonian mechanics
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FAQ_ITEMS.map((item) => (
            <FAQCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FAQ;

