import { Link } from "react-router-dom";

function PlaceholderPage({ title, description }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
      {description ? (
        <p className="mt-4 text-slate-600">{description}</p>
      ) : (
        <p className="mt-4 text-slate-600">
          This section will connect to the backend as modules are implemented
          (appointments, chat, admin, and more).
        </p>
      )}
      <Link
        to="/"
        className="mt-8 inline-block font-medium text-brand-teal hover:underline"
      >
        ← Back to Home
      </Link>
    </div>
  );
}
export default PlaceholderPage;
