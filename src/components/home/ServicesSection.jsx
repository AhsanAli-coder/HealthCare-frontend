const SERVICES = [
  {
    title: "Dental treatments",
    img: "/services/dental.jpg",
  },
  {
    title: "Bones treatments",
    img: "/services/bones.jpg",
  },
  {
    title: "Diagnosis",
    img: "/services/diagnosis.jpg",
  },
  {
    title: "Cardiology",
    img: "/services/cardiology.jpg",
  },
  {
    title: "Surgery",
    img: "/services/surgery.jpg",
  },
  {
    title: "Eye care",
    img: "/services/eye.jpg",
  },
];

const DESC =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalaracc lacus vel facilisis volutpat est velitom.";

function ServiceCard({ title, img }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
      <div className="overflow-hidden rounded-xl bg-slate-100">
        <img
          src={img}
          alt={title}
          className="h-40 w-full object-cover sm:h-44"
          loading="lazy"
          decoding="async"
        />
      </div>
      <h3 className="mt-5 text-sm font-bold text-[#007E85] sm:text-base">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[#5c6e82]">{DESC}</p>
      <button
        type="button"
        className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#007E85] hover:opacity-80"
      >
        Learn more
        <span aria-hidden>→</span>
      </button>
    </div>
  );
}

function ServicesSection() {
  return (
    <section className="bg-hero-bg py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-hero text-3xl font-bold text-[#007E85] sm:text-4xl">
            Services we provide
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#5c6e82] sm:text-base">
            Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar
            elementum tempus hac tellus libero accumsan.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} title={s.title} img={s.img} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ServicesSection;
