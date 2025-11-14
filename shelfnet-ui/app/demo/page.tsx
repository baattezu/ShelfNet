import { ShieldCheck, Search, CloudSun } from "lucide-react";
import { AuthForm } from "@/demo-src/components/AuthForm";
import { SessionPulse } from "@/demo-src/components/demo/SessionPulse";
import { RealtimeSearchCard } from "@/demo-src/components/demo/RealtimeSearchCard";
import { WeatherCard } from "@/demo-src/components/demo/WeatherCard";

const heroHighlights = [
  {
    icon: ShieldCheck,
    title: "Session guard",
    description: "Zustand store + cookies power middleware redirects",
  },
  {
    icon: Search,
    title: "Live GitHub search",
    description: "Debounced inputs, Zod validation, TanStack Query cache",
  },
  {
    icon: CloudSun,
    title: "Weather service",
    description: "Typed fetch helper hitting wttr.in with graceful errors",
  },
];

export default function DemoPage() {
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-linear-to-br from-sky-900/50 via-slate-900 to-slate-950 p-8 sm:p-10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.25),transparent_55%)]" />
        <div className="relative space-y-6">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-400">
            ShelfNet Patterns
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Auth, typed APIs, and real-time validation — all in one playground.
          </h1>
          <p className="max-w-3xl text-base text-slate-300">
            Use this route to demonstrate how we structure modern Next.js
            features: session-aware auth, external services wired through typed
            clients, TanStack Query caching, Zod + React Hook Form validation,
            and tasteful motion.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {heroHighlights.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80"
              >
                <div className="mb-2 inline-flex items-center gap-2 text-white">
                  <Icon size={18} className="text-sky-200" />
                  <span className="font-medium">{title}</span>
                </div>
                <p className="text-slate-200/70">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SessionPulse />

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="card border-white/5 p-6">
          <header className="mb-6 space-y-1">
            <p className="text-xs uppercase tracking-[0.5em] text-slate-400">
              Authentication
            </p>
            <h2 className="text-xl font-semibold text-white">
              Real-time validation with React Hook Form + Zod
            </h2>
            <p className="text-sm text-slate-400">
              Credentials:{" "}
              <code className="text-sky-300">
                mentor@shelfnet.dev / ReadMore!
              </code>
            </p>
          </header>
          <AuthForm />
        </section>
        <div className="space-y-6">
          <RealtimeSearchCard />
          <WeatherCard />
        </div>
      </div>
    </div>
  );
}
