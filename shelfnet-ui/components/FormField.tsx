export default function FormField({
  label,
  children,
  help,
  className = "",
}: {
  label?: string;
  children: React.ReactNode;
  help?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      {label ? <div className="text-sm font-medium mb-2">{label}</div> : null}
      {children}
      {help ? (
        <div className="text-xs text-text-muted-light dark:text-text-muted-dark mt-2">
          {help}
        </div>
      ) : null}
    </label>
  );
}
