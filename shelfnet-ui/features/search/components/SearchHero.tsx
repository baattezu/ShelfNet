"use client";

import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";

interface SearchHeroProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
}

export function SearchHero({
  query,
  onQueryChange,
  onSubmit,
}: SearchHeroProps) {
  return (
    <section className="space-y-6 rounded-3xl border border-slate-900/60 bg-slate-950/40 p-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sky-400">
        ShelfNet Universal Search
      </p>
      <h1 className="text-4xl font-bold text-white">
        Найдите книги, людей и клубы
      </h1>
      <p className="text-slate-400">
        Один запрос — и вы получаете совпадения по каталогу, профилям и
        сообществам. Скоро здесь окажется API.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Попробуйте 'dune' или 'sci-fi club'"
            icon={<Search size={18} />}
          />
        </div>
        <Button onClick={onSubmit} className="sm:w-auto">
          Искать
        </Button>
      </div>
    </section>
  );
}
