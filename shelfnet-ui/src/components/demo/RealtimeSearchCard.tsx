"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, GitFork, Star } from "lucide-react";
import { searchSchema, type SearchFormValues } from "@/src/utils/validators";
import { useDebouncedValue } from "@/src/hooks/useDebouncedValue";
import { github } from "@/src/services/api";
import SearchBar from "@/src/components/SearchBar";
import type { RepoSummary } from "@/src/models";

export function RealtimeSearchCard() {
  const {
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    mode: "onChange",
    defaultValues: { query: "shelfnet" },
  });

  // eslint-disable-next-line react-hooks/incompatible-library -- react-hook-form watch helper is scoped to this component.
  const liveQuery = watch("query", "shelfnet");
  const debouncedQuery = useDebouncedValue(liveQuery, 400);
  const hasMinimumChars = debouncedQuery.trim().length >= 2;

  const searchQuery = useQuery({
    queryKey: ["github-search", debouncedQuery],
    enabled: hasMinimumChars,
    queryFn: () => github.searchRepositories(debouncedQuery.trim()),
    select: (repos: RepoSummary[]) => repos.slice(0, 5),
    staleTime: 1000 * 60,
  });

  const helperMessage =
    errors.query?.message ||
    (hasMinimumChars
      ? searchQuery.isFetching
        ? "Searching GitHub…"
        : searchQuery.isSuccess
        ? searchQuery.data.length
          ? `Showing ${searchQuery.data.length} repo${
              searchQuery.data.length > 1 ? "s" : ""
            }`
          : "No repositories matched that query"
        : "Press enter to search GitHub"
      : "Type at least 2 characters to start searching");

  const status: "idle" | "loading" | "success" | "error" = errors.query
    ? "error"
    : searchQuery.isFetching
    ? "loading"
    : searchQuery.isSuccess
    ? "success"
    : "idle";

  const handleManualSearch = async () => {
    const valid = await trigger("query");
    if (valid) searchQuery.refetch();
  };

  const formattedResults = useMemo(() => {
    if (!searchQuery.data) return [] as RepoSummary[];
    return searchQuery.data;
  }, [searchQuery.data]);

  return (
    <section className="card border-white/5 p-5 shadow-lg shadow-sky-500/10">
      <header className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
            Live Search
          </p>
          <h3 className="text-lg font-semibold text-white">
            GitHub repositories via TanStack Query
          </h3>
        </div>
        <span className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300">
          React Query + Zod
        </span>
      </header>

      <SearchBar
        value={liveQuery}
        onChange={(value) => setValue("query", value, { shouldValidate: true })}
        onSubmit={handleManualSearch}
        onClear={() => setValue("query", "", { shouldValidate: true })}
        status={status}
        helper={helperMessage}
      />

      <div className="mt-5 space-y-3">
        {!hasMinimumChars && (
          <p className="text-sm text-slate-400">
            Start typing to fetch trending repos with live validation.
          </p>
        )}

        {searchQuery.isError && (
          <p className="rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {(searchQuery.error as Error)?.message ??
              "Unable to reach GitHub right now."}
          </p>
        )}

        <AnimatePresence>
          {formattedResults.map((repo) => (
            <motion.a
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-4 transition hover:border-sky-400/60"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-base font-semibold text-white group-hover:text-sky-200">
                    {repo.full_name}
                  </p>
                  <p className="text-sm text-slate-400 line-clamp-2">
                    {repo.description ?? "No description provided."}
                  </p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-slate-400 transition group-hover:text-sky-300" />
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                <span className="inline-flex items-center gap-1">
                  <Star size={14} className="text-amber-300" />
                  {repo.stargazers_count.toLocaleString()} stars
                </span>
                <span className="inline-flex items-center gap-1">
                  <GitFork size={14} className="text-slate-400" />
                  {repo.forks_count.toLocaleString()} forks
                </span>
                {repo.language ? <span>{repo.language}</span> : null}
                <span className="text-slate-500">
                  Updated {new Date(repo.updated_at).toLocaleDateString()}
                </span>
              </div>
            </motion.a>
          ))}
        </AnimatePresence>

        {searchQuery.isSuccess &&
        !searchQuery.isFetching &&
        formattedResults.length === 0 &&
        hasMinimumChars ? (
          <p className="text-sm text-slate-400">
            No repositories matched that query.
          </p>
        ) : null}
      </div>
    </section>
  );
}

export default RealtimeSearchCard;
