import React from "react";

export default function TagList({ tags }: { tags?: string[] }) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((t) => (
        <span
          key={t}
          className="inline-block bg-[#1e293b] text-[#94a3b8] px-3 py-1 rounded-full text-sm"
        >
          #{t}
        </span>
      ))}
    </div>
  );
}
