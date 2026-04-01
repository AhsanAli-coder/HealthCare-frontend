/**
 * Renders a stat with optional suffix (%, k) in lighter weight teal.
 */
function StatItem({ main, suffix, label }) {
  return (
    <div className="px-4 py-6 text-center">
      <p className="text-4xl font-bold tracking-tight text-[#007E85] md:text-5xl lg:text-6xl">
        <span>{main}</span>
        {suffix ? (
          <span className="font-semibold text-[#007E85]/80 md:text-[0.92em]">
            {suffix}
          </span>
        ) : null}
      </p>
      <p className="mt-3 text-sm font-bold text-slate-900 md:text-base">
        {label}
      </p>
    </div>
  );
}

export default StatItem;
