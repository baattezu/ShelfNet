import { Book } from "@/shared/types";
import { Card } from "@/shared/components/ui/Card";
import Link from "next/link";

interface ReadingTimelineProps {
  books: Book[];
}

export function ReadingTimeline({ books }: ReadingTimelineProps) {
  return (
    <Card className="space-y-4">
      <h3 className="text-xl font-semibold text-white">Активность чтения</h3>
      <ul className="space-y-3">
        {books.map((book) => (
          <li
            key={book.id}
            className="flex items-center justify-between rounded-2xl bg-slate-900/50 px-4 py-3"
          >
            <div>
              <p className="text-sm text-slate-400">Недавно</p>
              <p className="text-base font-semibold text-white">{book.title}</p>
              <p className="text-sm text-slate-400">{book.author}</p>
            </div>
            <Link
              href={`/books/${book.id}`}
              className="text-sm font-semibold text-sky-400 hover:text-sky-300"
            >
              Подробнее
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
