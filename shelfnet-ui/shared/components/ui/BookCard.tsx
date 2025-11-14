import Link from "next/link";
import Image from "next/image";
import { Book } from "@/shared/types";
import { Badge } from "./Badge";

interface BookCardProps {
  book: Book;
  href?: string;
}

export function BookCard({ book, href = `/books/${book.id}` }: BookCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 transition hover:border-sky-500/70 hover:bg-slate-900"
    >
      <div className="relative overflow-hidden rounded-2xl">
        <Image
          src={book.coverUrl}
          alt={book.title}
          width={320}
          height={420}
          className="aspect-3/4 w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-0 transition group-hover:opacity-100" />
        <span className="absolute bottom-3 left-3 text-sm font-semibold text-white">
          ⭐ {book.rating.toFixed(1)}
        </span>
      </div>
      <div>
        <p className="text-base font-semibold text-white">{book.title}</p>
        <p className="text-sm text-slate-400">{book.author}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {book.tags.slice(0, 2).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
    </Link>
  );
}
