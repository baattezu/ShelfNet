export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark p-4 shadow-md hover:shadow-lg transition ${className}`}
    >
      {children}
    </div>
  );
}
