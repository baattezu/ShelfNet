import { UserProfile } from "@/types";
import { Card } from "@/components/ui/Card";

interface ProfileStatsProps {
  profile: UserProfile;
}

export function ProfileStats({ profile }: ProfileStatsProps) {
  const stats = [
    { label: "Прочитано", value: profile.stats.booksRead },
    { label: "Рецензии", value: profile.stats.reviewsWritten },
    { label: "Сообщества", value: profile.stats.communitiesJoined },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.label} className="text-center">
          <p className="text-sm uppercase tracking-wide text-slate-400">
            {stat.label}
          </p>
          <p className="mt-2 text-3xl font-bold text-white">{stat.value}</p>
        </Card>
      ))}
    </div>
  );
}
