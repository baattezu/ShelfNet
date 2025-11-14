"use client";

import { PropsWithChildren } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface SiteLayoutProps extends PropsWithChildren {
  showFooter?: boolean;
}

export function SiteLayout({ children, showFooter = true }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col gap-10">
      <Header />
      <main className="flex-1 space-y-12">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
