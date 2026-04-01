const TEAM = [
  {
    name: "John Carter",
    role: "CEO & CO-FOUNDER",
    img: "/team/john.png",
  },
  {
    name: "Sophie Moore",
    role: "DENTAL SPECIALIST",
    img: "/team/sophie.png",
  },
  {
    name: "Matt Cannon",
    role: "ORTHOPEDIC",
    img: "/team/matt.png",
  },
  {
    name: "Andy Smith",
    role: "BRAIN SURGEON",
    img: "/team/andy.png",
  },
  {
    name: "Lily Woods",
    role: "HEART SPECIALIST",
    img: "/team/lily.png",
  },
  {
    name: "Patrick Meyer",
    role: "EYE SPECIALIST",
    img: "/team/patrick.png",
  },
];

const DESC =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit amet hendrerit pretium nulla sed enim iaculis mi.";

function SocialIcon({ type }) {
  const common = "h-4 w-4";
  switch (type) {
    case "facebook":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.676 0H1.324C.593 0 0 .593 0 1.324v21.352C0 23.407.593 24 1.324 24h11.495v-9.294H9.692V11.09h3.127V8.413c0-3.1 1.894-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24h-1.918c-1.504 0-1.796.715-1.796 1.763v2.31h3.59l-.467 3.616h-3.123V24h6.126C23.407 24 24 23.407 24 22.676V1.324C24 .593 23.407 0 22.676 0z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm9 2h-9A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4zm-4.5 3.2A4.8 4.8 0 1 1 7.2 12 4.81 4.81 0 0 1 12 7.2zm0 2A2.8 2.8 0 1 0 14.8 12 2.8 2.8 0 0 0 12 9.2zM17.3 6.6a1.1 1.1 0 1 1-1.1 1.1 1.1 1.1 0 0 1 1.1-1.1z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    default:
      return null;
  }
}

function SocialButton({ type }) {
  return (
    <button
      type="button"
      className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-sky-100 text-[#007E85] transition-colors hover:bg-sky-200/80"
      aria-label={type}
    >
      <SocialIcon type={type} />
    </button>
  );
}

function TeamCard({ member }) {
  return (
    <div className="rounded-2xl bg-white px-7 pb-8 pt-10 text-center shadow-sm shadow-slate-900/5 ring-1 ring-slate-200/70">
      <div className="mx-auto h-24 w-24 overflow-hidden rounded-full bg-slate-100">
        <img
          src={member.img}
          alt={member.name}
          className="h-full w-full object-cover"
          loading="lazy"
          decoding="async"
        />
      </div>

      <h3 className="mt-6 text-lg font-bold text-[#007E85]">
        {member.name}
      </h3>
      <p className="mt-1 text-xs font-extrabold tracking-[0.18em] text-slate-500">
        {member.role}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-[#5c6e82]">{DESC}</p>

      <div className="mt-6 flex justify-center gap-3">
        <SocialButton type="facebook" />
        <SocialButton type="twitter" />
        <SocialButton type="instagram" />
        <SocialButton type="linkedin" />
      </div>
    </div>
  );
}

function TeamMembers() {
  return (
    <section className="bg-hero-bg py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-hero text-3xl font-bold text-[#007E85] sm:text-4xl">
            Meet our team members
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#5c6e82] sm:text-base">
            Lorem ipsum dolor sit amet consectetur adipiscing elit volutpat
            gravida malesuada quam commodo id integer nam.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {TEAM.map((m) => (
            <TeamCard key={m.name} member={m} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamMembers;
