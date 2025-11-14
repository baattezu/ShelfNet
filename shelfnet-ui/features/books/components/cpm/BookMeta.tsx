import React from "react";

export default function BookMeta({ book }: { book: any }) {
  return (
    <div className="flex flex-col gap-4 bg-transparent">
      <div className="flex items-center gap-3 text-sm">
        <span
          className="material-symbols-outlined text-[#94a3b8]"
          style={{ fontSize: 20 }}
        >
          badge
        </span>
        <span className="text-[#94a3b8] w-28">Age:</span>
        <span className="font-medium">{book.age || "16+"}</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span
          className="material-symbols-outlined text-[#94a3b8]"
          style={{ fontSize: 20 }}
        >
          collections_bookmark
        </span>
        <span className="text-[#94a3b8] w-28">Series:</span>
        <span className="font-medium">{book.series || "—"}</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span
          className="material-symbols-outlined text-[#94a3b8]"
          style={{ fontSize: 20 }}
        >
          translate
        </span>
        <span className="text-[#94a3b8] w-28">Translator:</span>
        <span className="font-medium">{book.translator || "—"}</span>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span
          className="material-symbols-outlined text-[#94a3b8]"
          style={{ fontSize: 20 }}
        >
          menu_book
        </span>
        <span className="text-[#94a3b8] w-28">Pages:</span>
        <span className="font-medium">{book.pages || "—"}</span>
      </div>
    </div>
  );
}
