import { Book } from "@/shared/types";
import { BookCard } from "@/shared/components/ui/BookCard";

interface BooksGridProps {
  books: Book[];
}

export function BooksGrid({ books }: BooksGridProps) {
  if (!books.length) {
    return (
      <p className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6 text-sm text-slate-400">
        Нет результатов. Попробуйте изменить фильтры.
      </p>
    );
  }
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
