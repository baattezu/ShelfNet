import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "ShelfNet Demo | Auth, Search & External APIs",
  description:
    "Interactive playground showing auth, guarded routes, real-time validation, and external API integrations for ShelfNet.",
};

export default function DemoLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="glow-grid" aria-hidden />
      <div className="relative space-y-10">{children}</div>
    </div>
  );
}
