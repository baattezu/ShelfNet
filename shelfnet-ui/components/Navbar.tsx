"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import UserAvatar from "./UserAvatar";
import DropdownMenu from "./DropdownMenu";
import SearchBar from "./SearchBar";
import React from "react";

export default function Navbar() {
  const router = useRouter();

  function logout() {
    localStorage.removeItem("shelfnet_token");
    localStorage.removeItem("shelfnet_userId");
    router.push("/login");
  }

  const userId =
    typeof window !== "undefined"
      ? localStorage.getItem("shelfnet_userId")
      : null;

  const [q, setQ] = React.useState("");

  function doSearch() {
    if (!q) return;
    router.push(`/search?query=${encodeURIComponent(q)}`);
  }

  return (
    <header className="sticky top-0 z-40 backdrop-blur-sm bg-[#1e293b]/80 border-b border-[#334155]">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-[#3b82f6] text-white flex items-center justify-center">
              S
            </div>
            <span className="font-semibold">ShelfNet</span>
          </Link>
          <nav className="hidden lg:flex items-center gap-6 ml-4">
            <Link href="/" className="text-sm text-[#94a3b8] hover:text-white">
              Home
            </Link>
            <Link
              href="/books"
              className="text-sm text-[#94a3b8] hover:text-white"
            >
              Books
            </Link>
            <Link
              href="/community"
              className="text-sm text-[#94a3b8] hover:text-white"
            >
              Community
            </Link>
          </nav>
        </div>

        <div className="flex-1">
          <div className="max-w-lg mx-auto">
            <SearchBar value={q} onChange={setQ} onSearch={doSearch} />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/my"
            className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#0f172a]/5 text-sm"
          >
            🔖
          </Link>
          <div className="relative">
            <DropdownMenu trigger={<UserAvatar userId={userId} />}>
              <div className="py-1">
                <Link href="/profile" className="block px-4 py-2 text-sm">
                  Profile
                </Link>
                <Link href="/settings" className="block px-4 py-2 text-sm">
                  Settings
                </Link>
                <button
                  onClick={logout}
                  className="w-full text-left px-4 py-2 text-sm"
                >
                  Logout
                </button>
              </div>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
