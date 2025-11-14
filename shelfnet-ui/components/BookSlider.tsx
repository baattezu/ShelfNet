"use client";
import React from "react";
import BookCard from "./BookCard";

export default function BookSlider({ books }: { books: any[] }) {
  return (
    <div className="overflow-x-auto -mx-3 px-3 py-4">
      <div className="flex gap-4">
        {books.map((b, i) => (
          <div key={i} className="min-w-[200px] w-[200px]">
            <BookCard book={b} />
          </div>
        ))}
      </div>
    </div>
  );
}
