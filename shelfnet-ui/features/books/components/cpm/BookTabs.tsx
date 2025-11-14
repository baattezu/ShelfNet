"use client";
import React, { useEffect, useState } from "react";
import ReviewCard from "../book/ReviewCard";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export default function BookTabs({
  bookId,
  description,
}: {
  bookId?: string;
  description?: string;
}) {
  const tabs = ["Overview", "Reviews", "Quotes", "Reading now"];
  const [active, setActive] = useState(0);
  const [reviews, setReviews] = useState<Array<any>>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [newReview, setNewReview] = useState("");

  useEffect(() => {
    if (tabs[active] === "Reviews" && reviews.length === 0) {
      loadReviews();
    }
  }, [active]);

  async function loadReviews() {
    if (!bookId) return;
    setLoadingReviews(true);
    try {
      const res = await fetch(`${API}/books/${bookId}/reviews`);
      if (!res.ok) throw new Error("no reviews");
      const data = await res.json();
      setReviews(data || []);
    } catch (e) {
      // fallback mock reviews
      setReviews([
        {
          id: "r1",
          author: "Elena V.",
          rating: 4.5,
          text: "An absolute masterpiece. Fitzgerald's prose is poetic and haunting...",
        },
        {
          id: "r2",
          author: "Alex M.",
          rating: 4,
          text: "A timeless classic for a reason. I found Gatsby to be a deeply compelling character...",
        },
      ]);
    } finally {
      setLoadingReviews(false);
    }
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    const userId =
      typeof window !== "undefined"
        ? localStorage.getItem("shelfnet_userId")
        : null;
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("shelfnet_token")
        : null;
    if (!userId) {
      alert("Please sign in to leave a review");
      return;
    }
    try {
      const res = await fetch(`${API}/books/${bookId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ userId, text: newReview }),
      });
      if (!res.ok) throw new Error("failed");
      const saved = await res.json();
      setReviews((r) => [saved, ...r]);
      setNewReview("");
    } catch (err) {
      console.error(err);
      setReviews((r) => [
        {
          id: `local-${Date.now()}`,
          author: "You",
          rating: 5,
          text: newReview,
        },
        ...r,
      ]);
      setNewReview("");
    }
  }

  return (
    <div>
      <div className="border-b border-[#1e293b]">
        <nav className="flex items-center gap-6 -mb-px">
          {tabs.map((t, i) => (
            <button
              key={t}
              className={`py-3 px-1 text-sm font-medium ${
                i === active
                  ? "text-[#3b82f6] border-b-2 border-[#3b82f6]"
                  : "text-[#94a3b8]"
              }`}
              onClick={() => setActive(i)}
            >
              {t}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {tabs[active] === "Overview" && (
          <p className="text-[#94a3b8] leading-relaxed">{description}</p>
        )}

        {tabs[active] === "Reviews" && (
          <div className="flex flex-col gap-4">
            <form onSubmit={submitReview} className="flex flex-col gap-2">
              <textarea
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                placeholder="Leave a review"
                className="bg-[#0f172a] border border-[#1e293b] rounded-lg p-3 text-[#f8fafc]"
              />
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white"
                  type="submit"
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-[#1e293b] text-[#94a3b8]"
                  onClick={() => setNewReview("")}
                >
                  Cancel
                </button>
              </div>
            </form>

            {loadingReviews ? (
              <div>Loading reviews...</div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {reviews.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            )}
          </div>
        )}

        {tabs[active] === "Quotes" && (
          <div className="text-[#94a3b8]">Quotes will go here (mock)</div>
        )}

        {tabs[active] === "Reading now" && (
          <div className="text-[#94a3b8]">
            List of people reading now (mock)
          </div>
        )}
      </div>
    </div>
  );
}
