"use client";
import React from "react";
import Link from "next/link";

export default function UserAvatar({ userId }: { userId?: string | null }) {
  const initials = userId ? String(userId).slice(0, 2).toUpperCase() : "GN";
  return (
    <div className="w-10 h-10 rounded-full bg-slate-700 text-white flex items-center justify-center text-sm font-medium">
      {initials}
    </div>
  );
}
