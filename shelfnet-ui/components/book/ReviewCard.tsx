"use client";
import React, { useState } from "react";

export default function ReviewCard({
  review,
}: {
  review: { id?: string; author?: string; rating?: number; text?: string };
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#1e293b] p-6 rounded-2xl flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url('https://via.placeholder.com/40')` }}
        />
        <div>
          <p className="font-semibold">{review.author || "Anonymous"}</p>
          <div className="flex items-center text-yellow-400 text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className="material-symbols-outlined"
                style={{ fontSize: 16 }}
              >
                {i < (review.rating || 0) ? "star" : "star_border"}
              </span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[#94a3b8] text-sm leading-relaxed">
        {expanded
          ? review.text
          : `${(review.text || "").slice(0, 160)}${
              (review.text || "").length > 160 ? "..." : ""
            }`}
      </p>
      {review.text && review.text.length > 160 && (
        <button
          className="text-[#3b82f6] text-sm font-medium self-start"
          onClick={() => setExpanded((s) => !s)}
        >
          {expanded ? "Hide" : "Show more"}
        </button>
      )}
    </div>
  );
}
