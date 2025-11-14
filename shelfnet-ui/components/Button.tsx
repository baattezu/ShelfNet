export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost";
  children: React.ReactNode;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold transition-shadow shadow-md hover:shadow-lg";
  const variants: Record<string, string> = {
    primary: "bg-primary text-white hover:bg-primary/90",
    ghost: "bg-transparent text-current hover:bg-primary/5",
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
