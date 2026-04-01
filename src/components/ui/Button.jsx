const baseClass =
  "inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-base font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal disabled:pointer-events-none disabled:opacity-50";

const variantClasses = {
  primary:
    "bg-brand-teal text-white hover:bg-brand-teal-hover shadow-sm",
  secondary:
    "bg-brand-green text-white hover:bg-brand-green-hover shadow-sm",
  ghost: "bg-transparent text-brand-teal hover:bg-brand-teal/10",
  outline:
    "border-2 border-brand-teal text-brand-teal bg-white hover:bg-brand-teal/5",
};

/** Use with `<Link>` / `<a>` for the same look as `<Button>`. */
export function buttonClassName(variant = "primary", className = "") {
  const v = variantClasses[variant] ?? variantClasses.primary;
  return [baseClass, v, className].filter(Boolean).join(" ");
}

/**
 * @param {'primary' | 'secondary' | 'ghost' | 'outline'} variant
 */
function Button({
  children,
  variant = "primary",
  type = "button",
  className = "",
  ...props
}) {
  const v = variantClasses[variant] ?? variantClasses.primary;
  return (
    <button
      type={type}
      className={`${baseClass} ${v} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
