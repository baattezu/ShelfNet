export default function ProfileCard({ user }: { user: any }) {
  return (
    <div className="flex items-center gap-4 rounded-lg bg-[#1e293b] p-4">
      <div className="w-12 h-12 rounded-full bg-[#0f172a] flex items-center justify-center text-white">
        {(user?.name || "U").slice(0, 2).toUpperCase()}
      </div>
      <div>
        <div className="font-semibold text-white">{user?.name ?? "Name"}</div>
        <div className="text-xs text-[#94a3b8]">
          {user?.handle ?? user?.email ?? "@user"}
        </div>
      </div>
      <div className="ml-auto flex gap-2">
        <button className="px-3 py-1 rounded bg-[#3b82f6] text-white text-sm">
          Follow
        </button>
      </div>
    </div>
  );
}
