"use client";
import React from "react";

export default function PrimaryButton({
  children,
  onClick,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`w-full rounded-lg bg-[#3b82f6] text-white px-4 py-3 font-semibold shadow-md hover:shadow-lg transition ${className}`}
    >
      {children}
    </button>
  );
}
