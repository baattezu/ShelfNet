import { SiteLayout } from "@/shared/components/layout/SiteLayout";
import { SectionHeading } from "@/shared/components/ui/SectionHeading";
import { Card } from "@/shared/components/ui/Card";
import { Button } from "@/shared/components/ui/Button";
import { CommunityGrid } from "@/features/community/components/CommunityGrid";
import { communitiesMock } from "@/shared/lib/mockData";

const genreTags = [
  "Sci-Fi",
  "Detective",
  "Classics",
  "Fantasy",
  "Non-fiction",
  "Romance",
  "Business",
  "History",
];

export default function CommunityPage() {
  return (
    <SiteLayout>
      <SectionHeading
        title="Сообщества ShelfNet"
        subtitle="Живые клубы по жанрам, авторам и тематическим подборкам"
        action={
          <Button href="#" size="sm">
            Создать клуб
          </Button>
        }
      />

      <section className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
        <Card className="space-y-6 bg-slate-950/40">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-400">
            Spotlight
          </p>
          <h2 className="text-3xl font-bold text-white">Sci-Fi Explorers</h2>
          <p className="text-slate-300">
            Еженедельные дискуссии об антиутопиях, космических операх и
            футуристике. Скоро появится стрим с автором.
          </p>
          <Button>Присоединиться</Button>
        </Card>
        <Card className="space-y-4">
          <p className="text-sm font-semibold text-slate-400">Теги</p>
          <div className="flex flex-wrap gap-3">
            {genreTags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-slate-800 px-4 py-1 text-sm text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </Card>
      </section>

      <section className="space-y-6">
        <SectionHeading
          title="Популярные клубы"
          subtitle="Данные-заглушки — подключите API позже"
        />
        <CommunityGrid communities={communitiesMock} />
      </section>
    </SiteLayout>
  );
}
