import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/src/providers/query-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ShelfNet Patterns",
  description:
    "Scalable Next.js demo with auth, state-management, typed APIs, and real-time search examples.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="min-h-screen bg-slate-950 font-sans text-slate-50 antialiased">
        <QueryProvider>
          <div className="min-h-screen bg-slate-950">
            <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-8">
              {children}
            </div>
          </div>
        </QueryProvider>
      </body>
    </html>
  );
}
