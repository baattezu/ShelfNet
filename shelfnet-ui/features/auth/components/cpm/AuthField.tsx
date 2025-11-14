"use client";
import React from "react";

export default function AuthField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  icon,
}: {
  label?: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string | null;
  icon?: React.ReactNode;
}) {
  return (
    <label className="block">
      {label ? (
        <div className="text-sm font-medium mb-2 text-[#f8fafc]">{label}</div>
      ) : null}
      <div className="flex items-center gap-2">
        {icon ? <div className="text-[#94a3b8]">{icon}</div> : null}
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          type={type}
          placeholder={placeholder}
          className="flex-1 rounded-lg bg-[#1e293b] px-4 py-3 text-sm text-[#f8fafc] placeholder-[#94a3b8] outline-none border border-transparent focus:border-[#3b82f6]"
        />
      </div>
      {error ? <div className="text-xs text-red-500 mt-2">{error}</div> : null}
    </label>
  );
}
