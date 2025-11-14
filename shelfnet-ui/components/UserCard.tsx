export default function UserCard({ user }: { user?: any }) {
  return (
    <div className="transform rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg">
      <div className="flex items-start gap-4">
        {user?.avatar ? (
          <img
            className="h-12 w-12 rounded-full object-cover"
            src={user.avatar}
            alt={user.name}
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-lg font-bold text-slate-300">
            {(user?.name || "U").slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 dark:text-slate-50">
            {user?.name ?? "Full Name"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {user?.email ?? "email@example.com"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(user?.tags ?? ["Genre"]).map((t: string, i: number) => (
              <span
                key={i}
                className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
        <button className="text-slate-400 transition-colors hover:text-slate-600">
          {" "}
          <span className="material-symbols-outlined">more_vert</span>
        </button>
      </div>
    </div>
  );
}
