"use client";
import React, { useEffect, useState } from "react";
import LayoutContainer from "../../shared/components/LayoutContainer";
import PageHeader from "../../shared/components/PageHeader";
import services from "../../demo-src/services";
import { useAuth } from "../../hooks/useAuth";
import { Interaction, Book } from "../../demo-src/models";

export default function InteractionsPage() {
  const { session, loading: authLoading, isAuthenticated } = useAuth();
  const [interactions, setInteractions] = useState<
    (Interaction & { book?: Book | null })[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    const uid = session?.userId;
    if (!uid) return;

    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const items = await services.getInteractionsForUser(uid as string);
        const withBooks = await Promise.all(
          items.map(async (it) => {
            const b = await services.getBook(it.bookId);
            return { ...(it as Interaction), book: b ?? null };
          })
        );
        if (mounted) setInteractions(withBooks);
      } catch (e) {
        console.error("Failed loading interactions", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [session, authLoading]);

  return (
    <div className="font-display">
      <LayoutContainer>
        <main className="py-8">
          <PageHeader
            title="My interactions"
            subtitle="A list of your actions with books"
          />

          {!isAuthenticated ? (
            <div className="mt-6 text-sm text-text-muted-light">
              Sign in to see your interactions.
            </div>
          ) : loading ? (
            <div>Loading...</div>
          ) : (
            <div className="mt-6 space-y-3">
              {interactions.length === 0 ? (
                <div className="text-sm text-text-muted-light">
                  No interactions yet.
                </div>
              ) : (
                interactions.map((it) => (
                  <div
                    key={it.id}
                    className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-border-light dark:border-border-dark"
                  >
                    <div className="text-sm font-semibold">
                      {it.status
                        ? `Status — ${it.status}`
                        : it.rating != null
                        ? `Rating — ${it.rating}`
                        : it.favorite
                        ? "Favorite"
                        : "Interaction"}
                    </div>
                    <div className="text-xs text-text-muted-light">
                      Book: {it.book?.title ?? it.bookId}
                    </div>
                    {it.rating != null && (
                      <div className="text-xs text-text-muted-light">
                        Rating: {it.rating}
                      </div>
                    )}
                    {it.progress && (
                      <div className="text-xs text-text-muted-light">
                        Progress: {it.progress.page ?? "-"} pages (
                        {it.progress.percent ?? "-"}%)
                      </div>
                    )}
                    <div className="text-xs text-text-muted-light">
                      At: {it.createdAt ?? it.updatedAt ?? "-"}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </LayoutContainer>
    </div>
  );
}
