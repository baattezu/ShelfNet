import Link from "next/link";
import { ComponentPropsWithoutRef } from "react";
import clsx from "clsx";

const variantMap = {
  primary: "bg-sky-500 text-white hover:bg-sky-400 focus-visible:ring-sky-300",
  secondary:
    "bg-slate-800 text-slate-100 hover:bg-slate-700 focus-visible:ring-slate-500",
  outline:
    "border border-slate-700 text-slate-100 hover:border-sky-400 hover:text-white",
};

const sizeMap = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export type ButtonVariant = keyof typeof variantMap;
export type ButtonSize = keyof typeof sizeMap;

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  href,
  children,
  ...props
}: ButtonProps) {
  const sharedClassName = clsx(
    "inline-flex items-center justify-center rounded-xl font-semibold tracking-tight transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
    variantMap[variant],
    sizeMap[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={sharedClassName}>
        {children}
      </Link>
    );
  }
  return (
    <button className={sharedClassName} {...props}>
      {children}
    </button>
  );
}
