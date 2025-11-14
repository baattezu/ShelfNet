import { Book } from "@/types";
import { Card } from "@/components/ui/Card";

interface BookMetaPanelProps {
  book: Book;
}

export function BookMetaPanel({ book }: BookMetaPanelProps) {
  const meta = [
    { label: "Страниц", value: book.stats.pages },
    { label: "Язык", value: book.stats.language },
    { label: "Год", value: book.stats.year },
  ];

  return (
    <Card className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-400">Рейтинг</p>
        <p className="text-3xl font-bold text-white">
          ⭐ {book.rating.toFixed(1)}
        </p>
      </div>
      <div className="grid gap-3">
        {meta.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between rounded-2xl bg-slate-900/40 px-4 py-3"
          >
            <span className="text-sm text-slate-400">{item.label}</span>
            <span className="text-base font-semibold text-white">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
