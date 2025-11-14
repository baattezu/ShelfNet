"use client";

import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { BookCard } from "@/components/ui/BookCard";
import { Avatar } from "@/components/ui/Avatar";
import { SearchHero } from "@/features/search/components/SearchHero";
import { SearchResultsList } from "@/features/search/components/SearchResultsList";
import {
  booksMock,
  communitiesMock,
  globalSearchMock,
  readersMock,
} from "@/lib/mockData";

const filters = [
  { key: "all", label: "Все" },
  { key: "book", label: "Книги" },
  { key: "user", label: "Пользователи" },
  { key: "community", label: "Сообщества" },
] as const;

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]["key"]>("all");

  const filteredResults = useMemo(() => {
    return globalSearchMock.filter((result) => {
      const typeMatches =
        activeFilter === "all" || result.type === activeFilter;
      const queryMatches =
        !query ||
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.subtitle.toLowerCase().includes(query.toLowerCase());
      return typeMatches && queryMatches;
    });
  }, [activeFilter, query]);

  const featuredBooks = booksMock.slice(0, 4);
  const featuredReaders = readersMock.slice(0, 3);
  const featuredCommunities = communitiesMock.slice(0, 3);

  return (
    <SiteLayout>
      <SearchHero
        query={query}
        onQueryChange={setQuery}
        onSubmit={() => null}
      />

      <section className="space-y-6">
        <div className="flex flex-wrap gap-4">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`rounded-full px-5 py-2 text-sm transition ${
                activeFilter === filter.key
                  ? "bg-sky-500 text-white"
                  : "bg-slate-900/40 text-slate-400 hover:text-white"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
        <SearchResultsList results={filteredResults} />
      </section>

      <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div>
          <SectionHeading title="Книги" subtitle="Карточки из каталога" />
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {featuredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <Card className="space-y-4">
            <SectionHeading title="Читатели" />
            <div className="space-y-4">
              {featuredReaders.map((reader) => (
                <div key={reader.id} className="flex items-center gap-3">
                  <Avatar src={reader.avatarUrl} alt={reader.name} size={48} />
                  <div>
                    <p className="font-semibold text-white">{reader.name}</p>
                    <p className="text-sm text-slate-400">@{reader.username}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <Card className="space-y-4">
            <SectionHeading title="Сообщества" />
            <div className="space-y-3 text-sm text-slate-300">
              {featuredCommunities.map((community) => (
                <div
                  key={community.id}
                  className="rounded-2xl bg-slate-900/40 px-4 py-3"
                >
                  <p className="font-semibold text-white">{community.name}</p>
                  <p className="text-xs text-slate-400">
                    {community.members.toLocaleString("ru-RU")} участников
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>
    </SiteLayout>
  );
}
