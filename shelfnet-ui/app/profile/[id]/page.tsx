import { SiteLayout } from "@/components/layout/SiteLayout";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProfileHero } from "@/features/profile/components/ProfileHero";
import { ProfileStats } from "@/features/profile/components/ProfileStats";
import { ReadingTimeline } from "@/features/profile/components/ReadingTimeline";
import { CommunityGrid } from "@/features/community/components/CommunityGrid";
import { booksMock, communitiesMock, readersMock } from "@/lib/mockData";

interface ProfilePageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return readersMock.map((reader) => ({ id: reader.id }));
}

export function generateMetadata({ params }: ProfilePageProps) {
  const profile = readersMock.find((reader) => reader.id === params.id);
  return {
    title: profile ? `${profile.name} — ShelfNet` : "Профиль | ShelfNet",
    description: profile?.bio ?? "Профиль пользователя ShelfNet",
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const profile =
    readersMock.find((reader) => reader.id === params.id) ?? readersMock[0];
  const timelineBooks = booksMock.slice(0, 4);

  return (
    <SiteLayout>
      <ProfileHero profile={profile} />
      <ProfileStats profile={profile} />

      <section className="grid gap-10 lg:grid-cols-[2fr,1fr]">
        <div>
          <SectionHeading
            title="Мои клубы"
            subtitle="Пока используем статические данные"
          />
          <div className="mt-6">
            <CommunityGrid communities={communitiesMock} />
          </div>
        </div>
        <ReadingTimeline books={timelineBooks} />
      </section>
    </SiteLayout>
  );
}
