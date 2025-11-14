import React from "react";

export default function ProfileSidebar({ profile }: { profile: any }) {
  return (
    <div className="bg-[#1e293b] rounded-xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-center gap-4">
        <div
          className="w-20 h-20 rounded-full bg-center bg-cover"
          style={{ backgroundImage: `url('https://via.placeholder.com/160')` }}
        />
        <div>
          <h3 className="text-xl font-semibold">{profile.name}</h3>
          <p className="text-[#94a3b8] text-sm">{profile.role}</p>
        </div>
      </div>

      <button className="px-4 py-2 rounded-lg bg-[#3b82f6] text-white text-sm font-medium">
        Edit profile
      </button>

      <div>
        <h4 className="text-sm text-[#94a3b8] mb-2">Favorite genres</h4>
        <div className="flex flex-wrap gap-2">
          {profile.genres.map((g: string) => (
            <span
              key={g}
              className="inline-block bg-[#0f172a] text-[#94a3b8] px-3 py-1 rounded-full text-sm"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm text-[#94a3b8] mb-2">Favorite authors</h4>
        <ul className="list-inside list-disc text-sm text-[#f8fafc]">
          {profile.authors.map((a: string) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
