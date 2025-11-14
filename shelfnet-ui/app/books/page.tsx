"use client";

import { useMemo, useState } from "react";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BookFilters } from "@/features/books/components/BookFilters";
import { BooksRail } from "@/features/books/components/BooksRail";
import { BooksGrid } from "@/features/books/components/BooksGrid";
import { booksMock } from "@/lib/mockData";

const categories = ["Все", "Фантастика", "Non-fiction", "Фэнтези", "Классика"];

export default function BooksPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");

  const filteredBooks = useMemo(() => {
    return booksMock.filter((book) => {
      const matchesCategory =
        category === "Все" ||
        book.tags.some((tag) =>
          tag.toLowerCase().includes(category.toLowerCase())
        );
      const matchesQuery =
        !query ||
        book.title.toLowerCase().includes(query.toLowerCase()) ||
        book.author.toLowerCase().includes(query.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  return (
    <SiteLayout>
      <section className="space-y-6">
        <SectionHeading
          title="Каталог книг"
          subtitle="Интерактивная витрина — данные обновятся после подключения API"
        />
        <BookFilters
          query={query}
          onQueryChange={setQuery}
          onSearch={() => setQuery((value) => value.trim())}
          categories={categories}
          activeCategory={category}
          onCategorySelect={setCategory}
        />
      </section>

      <BooksRail title="Рекомендации" books={booksMock.slice(0, 5)} />

      <section className="space-y-6">
        <SectionHeading
          title="Каталог"
          subtitle="Фильтруйте по жанрам и авторам"
        />
        <BooksGrid books={filteredBooks} />
      </section>
    </SiteLayout>
  );
}
