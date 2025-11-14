import { Book } from "@/types";
import { BookCard } from "@/components/ui/BookCard";

interface BooksRailProps {
  title: string;
  books: Book[];
}

export function BooksRail({ title, books }: BooksRailProps) {
  return (
    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {books.map((book) => (
          <div key={book.id} className="w-48 shrink-0">
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </section>
  );
}
