"use client";

import { motion } from "framer-motion";
import { ShieldCheck, LogOut, Sparkles } from "lucide-react";
import AuthGuard from "@/demo-src/components/AuthGuard";
import { useAuth } from "@/demo-src/hooks/useAuth";

export default function ProtectedPage() {
  return (
    <AuthGuard fallbackPath="/demo">
      <ProtectedDashboard />
    </AuthGuard>
  );
}

function ProtectedDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.5em] text-slate-400">
            Protected route
          </p>
          <h1 className="text-3xl font-semibold text-white">
            Welcome back, {user?.name ?? "ShelfNet mentor"}
          </h1>
          <p className="text-sm text-slate-400">
            This page only renders when a valid session token exists in cookies.
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm text-slate-100 transition hover:border-rose-400/60"
        >
          <LogOut size={16} /> Sign out
        </button>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card border-emerald-500/20 p-6"
      >
        <div className="flex items-center gap-3 text-emerald-300">
          <ShieldCheck size={20} />
          Session token verified via middleware + AuthGuard
        </div>
        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">
              User
            </dt>
            <dd className="text-lg font-semibold text-white">{user?.email}</dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Roles
            </dt>
            <dd className="text-lg font-semibold text-white">
              {user?.roles?.join(", ") ?? "mentor"}
            </dd>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
            <dt className="text-xs uppercase tracking-[0.3em] text-slate-400">
              Token
            </dt>
            <dd className="text-lg font-semibold text-white">Active</dd>
          </div>
        </dl>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2">
        {["API previews stay hydrated", "UI state survives reloads"].map(
          (copy) => (
            <div
              key={copy}
              className="rounded-2xl border border-white/10 bg-slate-900/50 p-4 text-sm text-slate-300"
            >
              <div className="mb-2 inline-flex items-center gap-2 text-white">
                <Sparkles size={16} className="text-sky-300" />
                <span className="font-medium">{copy}</span>
              </div>
              <p>
                Cookie tokens keep middleware happy, while Zustand shares the
                same session with all client components.
              </p>
            </div>
          )
        )}
      </section>
    </div>
  );
}
