import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { BookCard } from "@/components/ui/BookCard";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { booksMock, communitiesMock, readersMock } from "@/lib/mockData";

export default function HomePage() {
  return (
    <SiteLayout>
      <section className="grid gap-10 lg:grid-cols-[1fr,320px]">
        <div className="space-y-8 rounded-3xl border border-slate-900/60 bg-slate-950/50 p-10">
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">
            ShelfNet · Universe for readers
          </p>
          <h1 className="text-5xl font-black text-white">
            Discover, Read, Connect.
          </h1>
          <p className="text-lg text-slate-300">
            В ShelfNet книги, профили и сообщества собраны в одну систему.
            Сохраняйте прогресс, собирайте клубы и делитесь рекомендациями.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button href="/books" size="lg">
              Открыть каталог
            </Button>
            <Button href="/community" variant="secondary" size="lg">
              Найти клуб
            </Button>
          </div>
        </div>
        <Card className="space-y-5 bg-slate-950/40">
          <p className="text-sm font-semibold text-sky-400">Сейчас читают</p>
          <div className="space-y-4">
            {booksMock.slice(0, 3).map((book) => (
              <div key={book.id} className="flex gap-4">
                <div
                  className="h-24 w-20 rounded-2xl bg-cover bg-center"
                  style={{ backgroundImage: `url(${book.coverUrl})` }}
                />
                <div>
                  <p className="text-base font-semibold text-white">
                    {book.title}
                  </p>
                  <p className="text-sm text-slate-400">{book.author}</p>
                  <p className="text-sm text-slate-400">
                    ⭐ {book.rating.toFixed(1)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <SectionHeading
          title="Популярное на ShelfNet"
          subtitle="Выборка на основе активности сообщества"
          action={
            <Button href="/books" variant="secondary" size="sm">
              Смотреть все
            </Button>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {booksMock.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          title="Найди свою читательскую группу"
          subtitle="Широкий выбор тематических клубов"
          action={
            <Button href="/community" size="sm">
              Все клубы
            </Button>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {communitiesMock.map((community) => (
            <Card key={community.id} className="space-y-4">
              <div
                className="h-28 rounded-2xl bg-cover bg-center"
                style={{ backgroundImage: `url(${community.coverUrl})` }}
              />
              <div>
                <p className="text-lg font-semibold text-white">
                  {community.name}
                </p>
                <p className="text-sm text-slate-400">
                  {community.members.toLocaleString("ru-RU")} участников
                </p>
              </div>
              <p className="text-sm text-slate-300">{community.description}</p>
              <Button variant="secondary">Вступить</Button>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          title="Подпишись на читателей"
          subtitle="Они делятся подборками и свежими обзорами"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {readersMock.map((reader) => (
            <Card key={reader.id} className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar src={reader.avatarUrl} alt={reader.name} size={56} />
                <div>
                  <p className="font-semibold text-white">{reader.name}</p>
                  <p className="text-sm text-slate-400">@{reader.username}</p>
                </div>
              </div>
              <p className="text-sm text-slate-300">{reader.bio}</p>
              <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                {reader.favoriteGenres.map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-slate-800 px-3 py-1"
                  >
                    {genre}
                  </span>
                ))}
              </div>
              <Button variant="secondary">Follow</Button>
            </Card>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
