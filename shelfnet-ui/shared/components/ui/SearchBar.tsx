"use client";
import React from "react";

export default function SearchBar({
  value,
  onChange,
  onSearch,
}: {
  value: string;
  onChange: (v: string) => void;
  onSearch?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 w-full">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSearch?.();
        }}
        className="flex-1 rounded-lg bg-[#1e293b] px-3 py-2 text-sm text-white placeholder:text-[#94a3b8] border border-[#334155]"
        placeholder="Search books, people, communities..."
      />
      <button
        onClick={onSearch}
        className="px-3 py-2 rounded-lg bg-[#3b82f6] text-white text-sm"
      >
        Search
      </button>
    </div>
  );
}
