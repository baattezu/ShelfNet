import { UserProfile } from "@/shared/types";
import { Avatar } from "@/shared/components/ui/Avatar";
import { Badge } from "@/shared/components/ui/Badge";
import { Button } from "@/shared/components/ui/Button";

interface ProfileHeroProps {
  profile: UserProfile;
}

export function ProfileHero({ profile }: ProfileHeroProps) {
  return (
    <section className="rounded-3xl border border-slate-900/60 bg-slate-950/40 p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <Avatar src={profile.avatarUrl} alt={profile.name} size={96} />
          <div>
            <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
            <p className="text-slate-400">@{profile.username}</p>
            <p className="mt-2 max-w-2xl text-slate-300">{profile.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {profile.favoriteGenres.map((genre) => (
                <Badge key={genre}>{genre}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary">Сообщение</Button>
          <Button>Подписаться</Button>
        </div>
      </div>
    </section>
  );
}
