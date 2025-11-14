import React from "react";

export default function ProfileStats({ stats }: { stats: any }) {
  const cards = [
    { value: stats.read, label: "Books read" },
    { value: stats.reviews, label: "Reviews written" },
    { value: stats.favoriteGenre, label: "Favorite genre" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c) => (
        <div
          key={c.label}
          className="flex flex-1 flex-col gap-2 rounded-xl border border-white/10 bg-[#1e293b] p-4 items-start hover:-translate-y-1 transition-transform"
        >
          <p className="text-white text-3xl font-bold">{c.value}</p>
          <p className="text-[#94a3b8] text-sm">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
