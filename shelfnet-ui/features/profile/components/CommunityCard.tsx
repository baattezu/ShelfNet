import React from "react";

export default function CommunityCard({ community }: { community: any }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-transparent hover:border-[#3b82f6] transition-all bg-[#0f172a] p-4">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-2xl" aria-hidden>
          {community.icon}
        </span>
        <div>
          <div className="font-semibold">{community.name}</div>
          <div className="text-[#94a3b8] text-sm">
            {community.members.toLocaleString()} members
          </div>
        </div>
      </div>
    </div>
  );
}
