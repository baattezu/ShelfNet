import { ComponentPropsWithoutRef, ReactNode, forwardRef } from "react";
import clsx from "clsx";

export interface InputProps extends ComponentPropsWithoutRef<"input"> {
  icon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, icon, ...props },
  ref
) {
  return (
    <label className="relative block">
      {icon && (
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          {icon}
        </span>
      )}
      <input
        ref={ref}
        className={clsx(
          "w-full rounded-2xl border border-slate-800 bg-slate-900/70 py-3 text-sm text-slate-50 placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500",
          icon && "pl-12",
          !icon && "px-4",
          className
        )}
        {...props}
      />
    </label>
  );
});
