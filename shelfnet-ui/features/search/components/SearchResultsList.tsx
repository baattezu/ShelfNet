import Link from "next/link";
import { SearchResult } from "@/shared/types";
import { Card } from "@/shared/components/ui/Card";

interface SearchResultsListProps {
  results: SearchResult[];
}

const typeLabels: Record<SearchResult["type"], string> = {
  book: "Книга",
  user: "Пользователь",
  community: "Сообщество",
};

export function SearchResultsList({ results }: SearchResultsListProps) {
  if (!results.length) {
    return (
      <Card className="text-center text-sm text-slate-400">
        Начните поиск, чтобы увидеть результаты.
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card
          key={result.id}
          className="flex items-center justify-between gap-4 bg-slate-950/50"
        >
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {typeLabels[result.type]}
            </p>
            <p className="text-lg font-semibold text-white">{result.title}</p>
            <p className="text-sm text-slate-400">{result.subtitle}</p>
          </div>
          <Link
            href={result.link}
            className="text-sm font-semibold text-sky-400 hover:text-sky-300"
          >
            Открыть
          </Link>
        </Card>
      ))}
    </div>
  );
}
