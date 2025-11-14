import React, { useState } from "react";

export default function UserForm({
  onSubmit,
}: {
  onSubmit: (data: any) => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [favoriteGenres, setFavoriteGenres] = useState("");
  const [favoriteAuthors, setFavoriteAuthors] = useState("");
  const [readingLevel, setReadingLevel] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      name,
      email,
      favoriteGenres: favoriteGenres
        ? favoriteGenres.split(",").map((s) => s.trim())
        : [],
      favoriteAuthors: favoriteAuthors
        ? favoriteAuthors.split(",").map((s) => s.trim())
        : [],
      readingLevel,
    });
    setName("");
    setEmail("");
    setFavoriteGenres("");
    setFavoriteAuthors("");
    setReadingLevel("");
  }

  return (
    <form onSubmit={submit} className="space-y-2 max-w-md">
      <input
        className="w-full p-2 border rounded"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Favorite genres (comma)"
        value={favoriteGenres}
        onChange={(e) => setFavoriteGenres(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Favorite authors (comma)"
        value={favoriteAuthors}
        onChange={(e) => setFavoriteAuthors(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Reading level"
        value={readingLevel}
        onChange={(e) => setReadingLevel(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-green-600 text-white rounded"
        type="submit"
      >
        Register
      </button>
    </form>
  );
}
