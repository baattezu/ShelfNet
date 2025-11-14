import React, { useState } from "react";

export default function BookForm({
  onSubmit,
}: {
  onSubmit: (data: any) => Promise<void>;
}) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [publisher, setPublisher] = useState("");
  const [year, setYear] = useState("");
  const [tags, setTags] = useState("");
  const [difficulty, setDifficulty] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      title,
      author,
      genre,
      publisher,
      year: year ? Number(year) : undefined,
      tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      difficulty,
    });
    setTitle("");
    setAuthor("");
    setGenre("");
    setPublisher("");
    setYear("");
    setTags("");
    setDifficulty("");
  }

  return (
    <form onSubmit={submit} className="space-y-2">
      <input
        className="w-full p-2 border rounded"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Genre"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Publisher"
        value={publisher}
        onChange={(e) => setPublisher(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Year"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Tags (comma separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <input
        className="w-full p-2 border rounded"
        placeholder="Difficulty"
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded"
        type="submit"
      >
        Add book
      </button>
    </form>
  );
}
