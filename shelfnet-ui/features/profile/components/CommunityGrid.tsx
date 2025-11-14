import React from "react";
import CommunityCard from "./CommunityCard";

export default function CommunityGrid({ communities }: { communities: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {communities.map((c) => (
        <CommunityCard key={c.name} community={c} />
      ))}
    </div>
  );
}
