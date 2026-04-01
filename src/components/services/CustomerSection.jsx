const CUSTOMERS = [
  {
    img: encodeURI("/servicesPage/customerImages/ec41d91f055ef9210d4caa05cab7b20681ce6acf.jpg"),
    alt: "Customer testimonial 1",
    stars: 4,
    text: "Slate helps you see how many more days you need to work to reach your financial goal.",
  },
  {
    img: encodeURI("/servicesPage/customerImages/09c66c758dd8fb10003a99942c4a1ff6301f7d9c.jpg"),
    alt: "Customer testimonial 2",
    stars: 4,
    text: "Slate helps you see how many more days you need to work to reach your financial goal.",
  },
  {
    img: encodeURI("/servicesPage/customerImages/f6260f00c600956f9eab58bd3be1b4ed9de978dd.jpg"),
    alt: "Customer testimonial 3",
    stars: 4,
    text: "Slate helps you see how many more days you need to work to reach your financial goal.",
  },
];

function Star({ filled }) {
  return (
    <svg
      className={`h-5 w-5 ${filled ? "text-amber-400" : "text-amber-200"}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function CustomerCard({ item }) {
  return (
    <div className="rounded-xl bg-white p-8 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, idx) => (
          <Star key={idx} filled={idx < item.stars} />
        ))}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-[#5c6e82]">
        {item.text}
      </p>

      <div className="mt-6">
        <img
          src={item.img}
          alt={item.alt}
          className="h-12 w-12 rounded-full object-cover ring-2 ring-white"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}

function CustomerSection() {
  return (
    <section className="bg-hero-bg py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-hero text-3xl font-bold text-[#007E85] sm:text-4xl">
            what our customers say
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#5c6e82] sm:text-base">
            Problems trying to resolve the conflict between the two major realms
            of Classical physics: Newtonian mechanics
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {CUSTOMERS.map((c, idx) => (
            <CustomerCard key={idx} item={c} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default CustomerSection;

