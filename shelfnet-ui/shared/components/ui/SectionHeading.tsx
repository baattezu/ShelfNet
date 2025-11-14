import { ReactNode } from "react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeading({
  title,
  subtitle,
  action,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
