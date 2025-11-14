export default function SectionHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>
        {subtitle ? (
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div className="mt-3 sm:mt-0">{actions}</div> : null}
    </div>
  );
}
