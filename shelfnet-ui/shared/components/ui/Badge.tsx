import clsx from "clsx";
import { ComponentPropsWithoutRef } from "react";

export function Badge({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300",
        className
      )}
      {...props}
    />
  );
}
