"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/useAuth";

export function AuthGuard({
  children,
  fallbackPath = "/login",
}: {
  children: React.ReactNode;
  fallbackPath?: string;
}) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(fallbackPath);
    }
  }, [isAuthenticated, fallbackPath, router]);

  if (!isAuthenticated) {
    return (
      <div className="card animate-pulse border border-slate-800/60 bg-slate-900/40 px-4 py-6 text-sm text-slate-300">
        Verifying session… you&apos;ll be redirected shortly.
      </div>
    );
  }
  return <>{children}</>;
}

export default AuthGuard;
