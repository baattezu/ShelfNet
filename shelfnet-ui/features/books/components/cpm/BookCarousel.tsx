import React from "react";
import Link from "next/link";

export default function BookCarousel({ books }: { books?: any[] }) {
  const items = books || [];
  return (
    <div className="flex overflow-x-auto space-x-4 pb-4 -mx-6 px-6">
      {items.slice(0, 6).map((b: any) => (
        <Link
          key={b.id}
          href={`/books/${b.id}`}
          className="flex-shrink-0 w-36 group"
        >
          <div
            className="w-full h-52 bg-center bg-no-repeat bg-cover rounded-lg shadow-lg shadow-black/20 mb-2 transform transition-transform duration-300 group-hover:scale-105"
            style={{
              backgroundImage: `url(${b.thumbnailUrl || "/placeholder.jpg"})`,
            }}
          />
          <h4 className="text-sm font-medium truncate group-hover:text-[#3b82f6]">
            {b.title}
          </h4>
          <p className="text-xs text-[#94a3b8] truncate">{b.author}</p>
        </Link>
      ))}
    </div>
  );
}
