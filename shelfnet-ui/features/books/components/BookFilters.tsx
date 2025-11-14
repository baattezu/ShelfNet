"use client";

import { Input } from "@/shared/components/ui/Input";
import { Button } from "@/shared/components/ui/Button";
import { Search } from "lucide-react";

export interface BookFiltersProps {
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  categories: string[];
  activeCategory?: string;
  onCategorySelect: (category: string) => void;
}

export function BookFilters({
  query,
  onQueryChange,
  onSearch,
  categories,
  activeCategory,
  onCategorySelect,
}: BookFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Поиск по названию, автору или тегам"
            icon={<Search size={18} />}
          />
        </div>
        <Button className="sm:w-auto" onClick={onSearch} variant="primary">
          Найти
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            className={`rounded-full border px-4 py-2 text-sm transition ${
              activeCategory === category
                ? "border-sky-500 bg-sky-500/10 text-white"
                : "border-slate-800 text-slate-400 hover:border-slate-600"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}
