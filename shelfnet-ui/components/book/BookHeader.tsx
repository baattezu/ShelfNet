"use client";
import React, { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface Book {
  id?: string;
  title?: string;
  author?: string;
  thumbnailUrl?: string;
}

export default function BookHeader({ book }: { book: Book }) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function sendInteraction(type: "WANT_TO_READ" | "READ") {
    const userId =
      typeof window !== "undefined"
        ? localStorage.getItem("shelfnet_userId")
        : null;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("shelfnet_token")
        : null;

    if (!userId) {
      alert("Please sign in to save");
      return;
    }

    setPending(true);
    try {
      const res = await fetch(`${API}/interactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId, bookId: book.id, type }),
      });

      if (!res.ok) {
        throw new Error(`Failed ${res.status}`);
      }

      setStatusMessage(
        type === "WANT_TO_READ" ? "Added to wishlist" : "Marked as read"
      );
    } catch (e) {
      console.error(e);
      setStatusMessage("Failed to save. Try again later");
    } finally {
      setPending(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  }

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-64 h-96 mx-auto md:mx-0">
        <div
          className="h-full w-full bg-center bg-no-repeat bg-cover rounded-xl shadow-lg shadow-black/30"
          style={{
            backgroundImage: `url(${book.thumbnailUrl || "/placeholder.jpg"})`,
          }}
          aria-hidden
        />
      </div>

      <div className="flex-1">
        <p className="text-[#3b82f6] text-sm font-medium leading-normal underline cursor-pointer hover:no-underline">
          {book.author}
        </p>
        <h1 className="text-3xl font-semibold leading-tight mt-1">
          {book.title}
        </h1>

        <div className="flex gap-3 mt-4">
          <button
            className="px-4 py-2 rounded-lg bg-[#1d4ed8] text-white text-sm font-bold hover:opacity-95 disabled:opacity-60"
            onClick={() => sendInteraction("WANT_TO_READ")}
            disabled={pending}
          >
            Want to read
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-[#15803d] text-white text-sm font-bold hover:opacity-95 disabled:opacity-60"
            onClick={() => sendInteraction("READ")}
            disabled={pending}
          >
            Read
          </button>

          <button className="w-10 h-10 rounded-lg bg-[#1e293b] text-[#f8fafc] flex items-center justify-center">
            ⋯
          </button>
        </div>

        {statusMessage && (
          <div className="mt-3 text-sm text-[#94a3b8]">{statusMessage}</div>
        )}
      </div>
    </div>
  );
}
