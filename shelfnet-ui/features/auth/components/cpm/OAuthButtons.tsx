"use client";
import React from "react";

export default function OAuthButtons() {
  return (
    <div className="flex gap-3">
      <button className="flex-1 rounded-lg bg-white text-black px-4 py-2 font-medium">
        Login with Google
      </button>
      <button className="flex-1 rounded-lg bg-black text-white px-4 py-2 font-medium">
        Login with Apple
      </button>
    </div>
  );
}
