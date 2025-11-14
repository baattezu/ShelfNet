import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

export function Card({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={clsx(
        "rounded-3xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl shadow-slate-900/40",
        className
      )}
      {...props}
    />
  );
}
