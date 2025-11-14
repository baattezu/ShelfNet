"use client";

import { motion } from "framer-motion";
import { ShieldCheck, LogOut } from "lucide-react";
import { useAuth } from "@/src/hooks/useAuth";

export function SessionPulse() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex flex-wrap items-center justify-between gap-4 border border-emerald-500/20 p-4"
    >
      <div className="flex items-center gap-3">
        <div
          className={`rounded-full border px-3 py-1 text-xs ${
            isAuthenticated
              ? "border-emerald-400 text-emerald-300"
              : "border-slate-600 text-slate-400"
          }`}
        >
          {isAuthenticated ? "session active" : "guest mode"}
        </div>
        <div>
          <p className="text-sm text-slate-300">
            {isAuthenticated
              ? `Signed in as ${user?.name ?? "Demo user"}`
              : "Authenticate below to access the protected area."}
          </p>
          <p className="text-xs text-slate-500">
            Cookie-backed token powers middleware checks + the AuthGuard
            component.
          </p>
        </div>
      </div>
      {isAuthenticated ? (
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-200 transition hover:border-rose-400/60"
        >
          <LogOut size={16} /> Sign out
        </button>
      ) : (
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <ShieldCheck size={16} className="text-emerald-400" />
          Login form below issues a short-lived session token.
        </div>
      )}
    </motion.div>
  );
}

export default SessionPulse;
