import Link from "next/link";

export interface NavigationItem {
  href: string;
  label: string;
}

interface NavigationProps {
  items: NavigationItem[];
  orientation?: "horizontal" | "vertical";
}

export function Navigation({
  items,
  orientation = "horizontal",
}: NavigationProps) {
  const baseClass =
    "flex gap-6 text-sm font-medium text-slate-400 transition-colors";
  const layoutClass =
    orientation === "horizontal"
      ? "items-center"
      : "flex-col items-start text-base";

  return (
    <nav className={`${baseClass} ${layoutClass}`}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="hover:text-white focus-visible:text-white"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
