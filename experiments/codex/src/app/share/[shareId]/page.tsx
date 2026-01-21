type ShareGame = {
  matchup: string;
  tags: string[];
  suggestion: string;
};

type ShareSnapshot = {
  shareId: string;
  profileDisplayName: string;
  headline: string;
  slateLabel: string;
  rankedGames: ShareGame[];
};

const MOCK_SNAPSHOTS: Record<string, ShareSnapshot> = {
  share_4b19c: {
    shareId: "share_4b19c",
    profileDisplayName: "Chad Cribbins",
    headline: "Momentum was not stable last night.",
    slateLabel: "Slate window: Dec 19, 07:30 to Dec 20, 07:30 (Europe/Lisbon)",
    rankedGames: [
      {
        matchup: "Thunder at Timberwolves",
        tags: ["late drama", "momentum swings", "playoff-style intensity"],
        suggestion: "watch fourth quarter full",
      },
      {
        matchup: "76ers at Knicks",
        tags: ["high-energy matchup", "guard-led pressure", "stretches of real tension"],
        suggestion: "condensed then fourth quarter full",
      },
      {
        matchup: "Bulls at Cavaliers",
        tags: ["offense-friendly", "lead changes vibe", "late push"],
        suggestion: "condensed then full late",
      },
    ],
  },
};

export default function SharePage({
  params,
}: {
  params: { shareId: string };
}) {
  const snapshot = MOCK_SNAPSHOTS[params.shareId];

  if (!snapshot) {
    return (
      <div className="app-shell">
        <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-6 py-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/60">
            Share not found
          </p>
          <h1 className="font-display text-4xl text-[color:var(--ink)]">
            This share link is expired.
          </h1>
          <p className="max-w-md text-sm text-[color:var(--navy)]/70">
            The slate window has moved on. Create a new spoiler-free list to
            share.
          </p>
          <a
            className="card-shadow inline-flex items-center justify-center rounded-full bg-[color:var(--navy)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--paper)]"
            href="/"
          >
            Run previous slate
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-10 px-6 py-12 md:px-12">
        <header className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/60">
              Spoiler-free share
            </p>
            <h1 className="font-display text-5xl text-[color:var(--ink)]">
              {snapshot.headline}
            </h1>
            <p className="mt-2 text-sm text-[color:var(--navy)]/70">
              {snapshot.slateLabel}
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-full border border-[color:var(--navy)]/20 bg-[color:var(--paper)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]">
            Curated by {snapshot.profileDisplayName}
          </div>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
          <div className="space-y-4">
            {snapshot.rankedGames.map((game, index) => (
              <article
                key={`${game.matchup}-${index}`}
                className="card-shadow rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--orange)]">
                      Rank {index + 1}
                    </p>
                    <h2 className="text-xl font-semibold text-[color:var(--ink)]">
                      {game.matchup}
                    </h2>
                    <p className="text-sm text-[color:var(--navy)]/70">
                      {game.suggestion}
                    </p>
                  </div>
                  <span className="rounded-full border border-[color:var(--navy)]/20 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]">
                    Watch
                  </span>
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
                Share ID
              </p>
              <p className="mt-2 font-mono text-sm text-[color:var(--ink)]">
                {snapshot.shareId}
              </p>
              <p className="mt-4 text-sm text-[color:var(--navy)]/70">
                Every tag is selected from a spoiler-safe library and reviewed
                against blocked phrases.
              </p>
            </div>

            <div className="rounded-3xl border border-[color:var(--navy)]/10 bg-white/70 p-6 text-center">
              <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-[color:var(--gold)] bg-[color:var(--navy)] text-[color:var(--paper)]">
                <span className="font-display text-3xl">GOAT</span>
              </div>
              <p className="mt-4 text-sm font-semibold uppercase tracking-[0.25em] text-[color:var(--navy)]/70">
                Build your own profile
              </p>
              <p className="mt-2 text-sm text-[color:var(--navy)]/70">
                Disagree with the ranking? Tune your teams and players in under
                two minutes.
              </p>
              <a
                className="mt-4 inline-flex items-center justify-center rounded-full bg-[color:var(--navy)] px-6 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--paper)]"
                href="/onboarding"
              >
                Create my list
              </a>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
