import { Community } from "@/shared/types";
import { CommunityCard } from "./CommunityCard";

interface CommunityGridProps {
  communities: Community[];
}

export function CommunityGrid({ communities }: CommunityGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}
    </div>
  );
}
