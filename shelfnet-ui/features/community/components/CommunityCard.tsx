import { Community } from "@/shared/types";
import { Button } from "@/shared/components/ui/Button";

interface CommunityCardProps {
  community: Community;
}

export function CommunityCard({ community }: CommunityCardProps) {
  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-900/60 bg-slate-950/40 p-6">
      <div
        className="h-24 rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${community.coverUrl})` }}
      />
      <div>
        <h3 className="text-lg font-semibold text-white">{community.name}</h3>
        <p className="text-sm text-slate-400">
          {community.members.toLocaleString("ru-RU")} участников
        </p>
      </div>
      <p className="text-sm text-slate-300">{community.description}</p>
      <Button variant="secondary">Присоединиться</Button>
    </div>
  );
}
