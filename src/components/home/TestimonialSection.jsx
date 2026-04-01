const TESTIMONIALS = [
  {
    name: "John Carter",
    title: "CEO at Google",
    quote: "An amazing service",
    text: "Lorem ipsum dolor sit ametoli col consectetur adipiscing lectus a nunc mauris scelerisque sed egestas.",
    img: "/testimonial/john.png",
    accent: "bg-slate-200",
  },
  {
    name: "Sophie Moore",
    title: "MD at Facebook",
    quote: "One of a kind service",
    text: "Ultrices eros in cursus turpis massa tincidunt sem nulla pharetra diam sit amet nisl suscipit adipis.",
    img: "/testimonial/sophie.png",
    accent: "bg-slate-200",
  },
  {
    name: "Andy Smith",
    title: "CEO Dot Austere",
    quote: "The best service",
    text: "Convallis posuere morbi leo urna molestie at elementum eu facilisis sapien pellentesque habitant.",
    img: "/testimonial/andy.png",
    accent: "bg-amber-200",
  },
];

function TestimonialCard({ item }) {
  return (
    <div className="rounded-2xl bg-white p-8 shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
      <div className="flex items-start">
        <div
          className={`flex h-14 w-14 items-center justify-center overflow-hidden rounded-full ${item.accent}`}
        >
          <img
            src={item.img}
            alt={item.name}
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <h3 className="mt-6 text-lg font-extrabold text-slate-900">
        “{item.quote}”
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[#5c6e82]">
        {item.text}
      </p>

      <div className="mt-8">
        <p className="text-sm font-bold text-[#007E85]">{item.name}</p>
        <p className="mt-1 text-sm text-slate-500">{item.title}</p>
      </div>
    </div>
  );
}

function TestimonialSection() {
  return (
    <section className="bg-hero-bg py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-hero text-3xl font-bold text-[#007E85] sm:text-4xl">
            Testimonial
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#5c6e82] sm:text-base">
            Lorem ipsum dolor sit amet consectetur adipiscing elit semper dalar
            elementum tempus hac tellus libero accumsan.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.name} item={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialSection;
