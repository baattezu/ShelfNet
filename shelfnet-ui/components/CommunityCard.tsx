export default function CommunityCard({ community }: { community: any }) {
  const img = community.image || community.cover || "";
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl bg-[#1e293b] p-4">
      <div
        className="w-24 h-24 rounded-full bg-center bg-cover"
        style={{ backgroundImage: img ? `url(${img})` : undefined }}
      />
      <div className="text-center">
        <div className="font-semibold text-white">{community.name}</div>
        <div className="text-xs text-[#94a3b8]">
          {community.members ?? "—"} members
        </div>
      </div>
      <button className="w-full px-3 py-2 rounded-lg bg-[#3b82f6] text-white text-sm">
        {community.joined ? "Joined" : "Join"}
      </button>
    </div>
  );
}
