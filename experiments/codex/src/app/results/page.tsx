"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type RankedGame = {
  rank: number;
  gameId: string;
  matchup: string;
  tags: string[];
  watchSuggestion: string;
  watchLink?: string;
};

type UpcomingGame = {
  gameId: string;
  matchup: string;
  tipTime: string;
  previewTags: string[];
  pick: string;
};

type SlateResponse = {
  meta: {
    generatedAt: string;
    timezone: string;
    slateWindow: {
      start: string;
      end: string;
      label: string;
    };
    gamesCount: number;
  };
  rankedGames: RankedGame[];
  upcomingGames: UpcomingGame[];
};

const parseDateParam = (value: string) => {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) {
    return null;
  }
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
};

const formatDateParam = (date: Date) => {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(
    2,
    "0",
  )}-${String(date.getUTCDate()).padStart(2, "0")}`;
};

const ResultsFallback = () => (
  <div className="app-shell">
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12 md:px-12">
      <div className="rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-6 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/60">
        Loading results...
      </div>
    </main>
  </div>
);

const ResultsContent = () => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const timeZone = useMemo(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone ?? "UTC",
    [],
  );
  const [data, setData] = useState<SlateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (date) {
      params.set("date", date);
    }
    if (timeZone) {
      params.set("tz", timeZone);
    }

    const fetchSlate = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/slate?${params.toString()}`, {
          cache: "no-store",
        });
        if (!response.ok) {
          throw new Error("Failed to load slate.");
        }
        const json = (await response.json()) as SlateResponse;
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load slate.");
      } finally {
        setLoading(false);
      }
    };

    void fetchSlate();
  }, [date, timeZone]);

  const rankedGames = data?.rankedGames ?? [];
  const upcomingGames = data?.upcomingGames ?? [];
  const resolvedDateParam = useMemo(() => {
    if (date) {
      const parsed = parseDateParam(date);
      if (!parsed) {
        return null;
      }
      return new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day));
    }
    if (data?.meta.slateWindow.start) {
      const slateStart = new Date(data.meta.slateWindow.start);
      return new Date(
        Date.UTC(
          slateStart.getUTCFullYear(),
          slateStart.getUTCMonth(),
          slateStart.getUTCDate(),
        ),
      );
    }
    return null;
  }, [date, data]);
  const previousDateParam = resolvedDateParam
    ? formatDateParam(
        new Date(resolvedDateParam.getTime() - 24 * 60 * 60 * 1000),
      )
    : null;
  const nextDateParam = resolvedDateParam
    ? formatDateParam(
        new Date(resolvedDateParam.getTime() + 24 * 60 * 60 * 1000),
      )
    : null;
  const resolvedDateLabel = useMemo(() => {
    if (!resolvedDateParam) {
      return null;
    }
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: data?.meta.timezone ?? timeZone,
    }).format(resolvedDateParam);
  }, [resolvedDateParam, data, timeZone]);
  const kickoffDateLabel = useMemo(() => {
    if (!data?.meta.slateWindow.start) {
      return null;
    }
    const kickoffDate = new Date(data.meta.slateWindow.start);
    const formatter = new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: data.meta.timezone ?? timeZone,
    });
    return formatter.format(kickoffDate);
  }, [data, timeZone]);

  return (
    <div className="app-shell">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-6 py-12 md:px-12">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/60">
              {data?.meta.slateWindow.label ?? "Previous slate"}
            </p>
            <h1 className="font-display text-5xl text-[color:var(--ink)]">
              Spoiler-free watch list
            </h1>
            {kickoffDateLabel ? (
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[color:var(--navy)]/60">
                Games kicked off: {kickoffDateLabel}
              </p>
            ) : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              className="card-shadow inline-flex items-center justify-center rounded-full bg-[color:var(--navy)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--paper)]"
              href="/preferences"
            >
              Tune watchability
            </a>
            <a
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--navy)]/30 bg-[color:var(--paper)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--navy)]"
              href="/share/share_4b19c"
            >
              Share this list
            </a>
          </div>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/60">
          <div className="flex items-center gap-2">
            <a
              className="rounded-full border border-[color:var(--navy)]/20 px-3 py-1 text-[10px]"
              href={previousDateParam ? `/results?date=${previousDateParam}` : "#"}
            >
              Prev
            </a>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--navy)]/50">
              {resolvedDateLabel ?? "Last night"}
            </span>
            <a
              className="rounded-full border border-[color:var(--navy)]/20 px-3 py-1 text-[10px]"
              href={nextDateParam ? `/results?date=${nextDateParam}` : "#"}
            >
              Next
            </a>
          </div>
          <a
            className="text-[10px] uppercase tracking-[0.3em] text-[color:var(--navy)]/60"
            href="/preferences"
          >
            Tune my score
          </a>
        </div>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {loading ? (
              <div className="card-shadow rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-6 text-sm text-[color:var(--navy)]/70">
                Loading spoiler-free slate...
              </div>
            ) : null}
            {error ? (
              <div className="card-shadow rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-6 text-sm text-[color:var(--navy)]/70">
                {error}
              </div>
            ) : null}
            {!loading && !error && rankedGames.length === 0 ? (
              <div className="card-shadow rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-6 text-sm text-[color:var(--navy)]/70">
                No completed games in this slate window.
              </div>
            ) : null}
            {rankedGames.map((game) => (
              <article
                key={game.gameId}
                className="card-shadow rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="font-display text-3xl text-[color:var(--orange)]">
                      {game.rank}
                    </span>
                    <div>
                      <h2 className="text-xl font-semibold text-[color:var(--ink)]">
                        {game.matchup}
                      </h2>
                      <p className="text-sm text-[color:var(--navy)]/70">
                        {game.watchSuggestion}
                      </p>
                    </div>
                  </div>
                  {game.watchLink ? (
                    <a
                      className="rounded-full border border-[color:var(--navy)]/30 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]"
                      href={game.watchLink}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Watch
                    </a>
                  ) : (
                    <button className="rounded-full border border-[color:var(--navy)]/30 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]">
                      Watch
                    </button>
                  )}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {game.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[color:var(--navy)]/20 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/70"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <aside className="flex flex-col gap-6">
            <div className="card-shadow rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/60">
                Slate vibe
              </p>
              <h2 className="font-display mt-3 text-3xl text-[color:var(--ink)]">
                Momentum was not stable last night.
              </h2>
              <p className="mt-3 text-sm text-[color:var(--navy)]/70">
                Tags are drawn from a spoiler-safe library and filtered against
                blocked phrases.
              </p>
            </div>

            {upcomingGames.length > 0 ? (
              <div className="rounded-3xl border border-[color:var(--navy)]/10 bg-white/70 p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--orange)]">
                  Upcoming preview
                </p>
                <p className="mt-2 text-sm text-[color:var(--navy)]/70">
                  Early teases and a lean pick. Set reminders soon.
                </p>
                <div className="mt-4 space-y-4">
                  {upcomingGames.map((game) => (
                    <div key={game.gameId} className="space-y-2">
                      <p className="text-base font-semibold text-[color:var(--ink)]">
                        {game.matchup}
                      </p>
                      <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--navy)]/60">
                        {game.pick}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {game.previewTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-[color:var(--navy)]/20 bg-[color:var(--paper)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </section>
      </main>
    </div>
  );
};

export default function ResultsPage() {
  return (
    <Suspense fallback={<ResultsFallback />}>
      <ResultsContent />
    </Suspense>
  );
}
