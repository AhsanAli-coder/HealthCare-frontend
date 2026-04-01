import StatItem from "./StatItem.jsx";

const STATS = [
  { main: "99", suffix: "%", label: "Customer satisfaction" },
  { main: "15", suffix: "k", label: "Online Patients" },
  { main: "12", suffix: "k", label: "Patients Recovered" },
  { main: "240", suffix: "%", label: "Company growth" },
];

function StatsSection() {
  return (
    <section className="bg-hero-bg py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-[#007E85] md:text-3xl">
          Our results in numbers
        </h2>
        <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6 lg:gap-10">
          {STATS.map((item) => (
            <StatItem
              key={item.label}
              main={item.main}
              suffix={item.suffix}
              label={item.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
