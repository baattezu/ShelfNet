import Link from "next/link";

const footerLinks = {
  platform: [
    { label: "Каталог", href: "/books" },
    { label: "Сообщества", href: "/community" },
    { label: "Поиск", href: "/search" },
  ],
  company: [
    { label: "О нас", href: "#" },
    { label: "Команда", href: "#" },
    { label: "Контакты", href: "#" },
  ],
  legal: [
    { label: "Условия", href: "#" },
    { label: "Конфиденциальность", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-16 rounded-3xl border border-slate-900/60 bg-slate-950/40 p-8 text-sm text-slate-400">
      <div className="grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-3 text-white">
            <span className="inline-flex size-10 items-center justify-center rounded-2xl bg-sky-500 text-lg font-bold">
              SN
            </span>
            <div>
              <p className="text-base font-semibold">ShelfNet</p>
              <p className="text-xs text-slate-500">
                Discover · Read · Connect
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-slate-400">
            Сообщество читателей, где каталоги, клубы и профили живут в одном
            гибком интерфейсе.
          </p>
        </div>
        {Object.entries(footerLinks).map(([section, links]) => (
          <div key={section} className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              {section}
            </p>
            <ul className="space-y-2">
              {links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-slate-400 transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} ShelfNet. Все права защищены.
      </p>
    </footer>
  );
}
