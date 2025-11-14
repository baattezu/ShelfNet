"use client";
import React from "react";
import SearchBar from "./SearchBar";
import { useRouter } from "next/navigation";

export default function SearchShell({
  initialQuery,
}: {
  initialQuery?: string;
}) {
  const [q, setQ] = React.useState(initialQuery ?? "");
  const router = useRouter();

  function doSearch() {
    if (!q) return;
    router.push(`/search?query=${encodeURIComponent(q)}`);
  }

  return <SearchBar value={q} onChange={setQ} onSearch={doSearch} />;
}
