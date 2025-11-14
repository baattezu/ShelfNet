"use client";
import React from "react";

export default function AuthMessage({
  type = "error",
  children,
}: {
  type?: "error" | "success" | "info";
  children: React.ReactNode;
}) {
  const bg =
    type === "error"
      ? "bg-red-600"
      : type === "success"
      ? "bg-green-600"
      : "bg-slate-700";
  return (
    <div className={`${bg} text-white px-4 py-2 rounded-md text-sm`}>
      {children}
    </div>
  );
}
