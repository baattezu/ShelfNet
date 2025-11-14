"use client";
import React from "react";

export default function AuthCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#0b1220] rounded-xl overflow-hidden shadow-md ${className}`}
    >
      <div className="flex flex-col md:flex-row">
        <div className="hidden md:flex w-1/2 bg-[url('/auth-illustration.jpg')] bg-cover bg-center" />
        <div className="w-full md:w-1/2 p-8 bg-[#0f172a]">{children}</div>
      </div>
    </div>
  );
}
