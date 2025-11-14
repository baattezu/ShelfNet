import Image from "next/image";
import { Book } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface BookDetailHeroProps {
  book: Book;
}

export function BookDetailHero({ book }: BookDetailHeroProps) {
  return (
    <section className="grid gap-10 lg:grid-cols-[320px,1fr]">
      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/40">
        <Image
          src={book.coverUrl}
          alt={book.title}
          width={360}
          height={480}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-widest text-slate-400">
            {book.category}
          </p>
          <h1 className="mt-3 text-4xl font-bold text-white">{book.title}</h1>
          <p className="text-lg text-slate-300">{book.author}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {book.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
        <p className="text-base text-slate-300">{book.description}</p>
        <div className="flex gap-3">
          <Button size="lg">Добавить в полку</Button>
          <Button size="lg" variant="secondary">
            Поделиться
          </Button>
        </div>
      </div>
    </section>
  );
}
