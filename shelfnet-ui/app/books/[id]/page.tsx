import { notFound } from "next/navigation";
import { SiteLayout } from "@/shared/components/layout/SiteLayout";
import { SectionHeading } from "@/shared/components/ui/SectionHeading";
import { BooksRail } from "@/features/books/components/BooksRail";
import { BookDetailHero } from "@/features/books/components/BookDetailHero";
import { BookMetaPanel } from "@/features/books/components/BookMetaPanel";
import { booksMock } from "@/shared/lib/mockData";

interface BookPageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return booksMock.map((book) => ({ id: book.id }));
}

export function generateMetadata({ params }: BookPageProps) {
  const book = booksMock.find((item) => item.id === params.id);
  return {
    title: book ? `${book.title} — ShelfNet` : "Книга | ShelfNet",
    description: book?.description ?? "Детали книги ShelfNet",
  };
}

export default function BookPage({ params }: BookPageProps) {
  const book = booksMock.find((item) => item.id === params.id);
  if (!book) {
    notFound();
  }

  const similar = booksMock.filter((item) => item.id !== book.id).slice(0, 4);

  return (
    <SiteLayout>
      <BookDetailHero book={book} />

      <section className="grid gap-10 lg:grid-cols-[2fr,1fr]">
        <div>
          <SectionHeading
            title="О книге"
            subtitle="Текст появится после подключения описаний"
          />
          <p className="mt-4 text-slate-300">{book.description}</p>
        </div>
        <BookMetaPanel book={book} />
      </section>

      <BooksRail title="Похожие книги" books={similar} />
    </SiteLayout>
  );
}
