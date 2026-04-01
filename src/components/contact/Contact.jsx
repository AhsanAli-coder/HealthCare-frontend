import { useId, useState } from "react";

const TOPICS = [
  "General inquiry",
  "Appointments",
  "Billing",
  "Technical support",
  "Partnerships",
];

function Label({ children }) {
  return <span className="text-xs font-semibold text-slate-700">{children}</span>;
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`mt-2 h-11 w-full rounded-lg border border-[#007E85]/60 bg-white px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20 ${className}`}
      {...props}
    />
  );
}

function Select({ className = "", children, ...props }) {
  return (
    <select
      className={`mt-2 h-11 w-full rounded-lg border border-[#007E85]/60 bg-white px-4 text-sm text-slate-900 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20 ${className}`}
      {...props}
    >
      {children}
    </select>
  );
}

function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`mt-2 min-h-[150px] w-full resize-none rounded-lg border border-[#007E85]/60 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#007E85] focus:outline-none focus:ring-2 focus:ring-[#007E85]/20 ${className}`}
      {...props}
    />
  );
}

function Contact() {
  const id = useId();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    topic: "",
    message: "",
    accept: false,
  });

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    // UI-only for now.
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      topic: "",
      message: "",
      accept: false,
    });
  }

  return (
    <section className="bg-hero-bg py-16 md:py-20">
      <div className="mx-auto max-w-4xl px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
            Get In Touch
          </p>
          <h2 className="mt-3 font-hero text-4xl font-bold text-slate-800 sm:text-5xl">
            Contact Us
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-[#5c6e82] sm:text-base">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <form onSubmit={onSubmit} className="mx-auto mt-12 max-w-3xl">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <Label>First name</Label>
              <Input
                value={form.firstName}
                onChange={(e) => setField("firstName", e.target.value)}
                placeholder="Enter your first name"
                autoComplete="given-name"
              />
            </label>

            <label className="block">
              <Label>Last name</Label>
              <Input
                value={form.lastName}
                onChange={(e) => setField("lastName", e.target.value)}
                placeholder="Enter your last name"
                autoComplete="family-name"
              />
            </label>

            <label className="block">
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
              />
            </label>

            <label className="block">
              <Label>Phone number</Label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="Enter your phone number"
                autoComplete="tel"
              />
            </label>
          </div>

          <div className="mt-5">
            <label className="block">
              <Label>Choose a topic</Label>
              <Select
                value={form.topic}
                onChange={(e) => setField("topic", e.target.value)}
              >
                <option value="" disabled>
                  Select one...
                </option>
                {TOPICS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </label>
          </div>

          <div className="mt-5">
            <label className="block">
              <Label>Message</Label>
              <Textarea
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                placeholder="Type your message..."
              />
            </label>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <input
              id={`${id}-terms`}
              type="checkbox"
              checked={form.accept}
              onChange={(e) => setField("accept", e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-[#007E85] focus:ring-[#007E85]/30"
            />
            <label
              htmlFor={`${id}-terms`}
              className="text-xs text-slate-600"
            >
              I accept the terms
            </label>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              className="h-12 w-full max-w-xs rounded-lg bg-[#007E85] text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#006970] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#007E85]"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default Contact;

