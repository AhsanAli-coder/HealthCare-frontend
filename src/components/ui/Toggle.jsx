function Toggle({ checked, onChange, id, label, disabled = false }) {
  return (
    <div className="flex items-center gap-3">
      {label ? (
        <label
          htmlFor={id}
          className="text-sm font-medium text-slate-700 cursor-pointer select-none"
        >
          {label}
        </label>
      ) : null}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal disabled:opacity-50 ${
          checked ? "bg-brand-green" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default Toggle;
