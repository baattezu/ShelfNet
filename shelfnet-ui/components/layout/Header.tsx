import Link from "next/link";
import { Navigation } from "./Navigation";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Search } from "lucide-react";

const navItems = [
  { href: "/", label: "Главная" },
  { href: "/books", label: "Каталог" },
  { href: "/community", label: "Сообщества" },
  { href: "/search", label: "Поиск" },
];

export function Header() {
  return (
    <header className="flex flex-col gap-6 rounded-3xl border border-slate-900/60 bg-slate-950/60 p-6 backdrop-blur">
      <div className="flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 text-xl font-bold">
          <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-sky-500 text-lg text-white">
            SN
          </span>
          ShelfNet
        </Link>
        <div className="hidden lg:flex flex-1 justify-center">
          <Navigation items={navItems} />
        </div>
        <div className="hidden md:flex items-center gap-3">
          <Button variant="secondary" size="sm" href="/login">
            Войти
          </Button>
          <Button size="sm" href="/register">
            Регистрация
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex flex-1 justify-end gap-3 lg:hidden">
          <Navigation items={navItems} orientation="vertical" />
        </div>
      </div>
    </header>
  );
}
