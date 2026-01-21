export default function Home() {
  return (
    <div className="app-shell">
      <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-16 px-6 py-12 md:px-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--navy)] text-[color:var(--paper)]">
              <span className="font-display text-2xl">NS</span>
            </div>
            <div>
              <p className="font-display text-2xl">No Spoilers</p>
              <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--navy)]/70">
                NBA watchability
              </p>
            </div>
          </div>
          <div className="hidden items-center gap-3 rounded-full border border-[color:var(--navy)]/20 bg-[color:var(--paper)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)] md:flex">
            Spoiler pledge: no scores, no winners
          </div>
        </header>

        <section className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col gap-8">
            <div className="inline-flex w-fit items-center gap-3 rounded-full border border-[color:var(--orange)]/50 bg-[color:var(--paper)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--orange)]">
              Morning ritual, zero spoilers
            </div>
            <div className="space-y-4">
              <h1 className="font-display text-5xl leading-[0.95] text-[color:var(--ink)] md:text-6xl">
                Pick what to watch, not what to skip.
              </h1>
              <p className="text-lg text-[color:var(--navy)]/80">
                Run the previous slate and get a ranked list of games with
                spoiler-safe reasons, tailored to your teams, players, and style.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                className="card-shadow inline-flex items-center justify-center rounded-full bg-[color:var(--navy)] px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--paper)] transition hover:-translate-y-0.5 hover:bg-[color:var(--ink)]"
                href="/results"
              >
                Run previous slate
              </a>
              <a
                className="inline-flex items-center justify-center rounded-full border border-[color:var(--navy)]/30 bg-[color:var(--paper)] px-7 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)] transition hover:-translate-y-0.5 hover:border-[color:var(--navy)]"
                href="/onboarding"
              >
                Build your profile
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                {
                  title: "No spoilers",
                  detail: "Whitelisted tags only.",
                },
                {
                  title: "Rolling window",
                  detail: "Previous slate at 7:30 local.",
                },
                {
                  title: "Watch guidance",
                  detail: "Condensed vs full cues.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)]/70 p-4"
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/60">
                    {item.title}
                  </p>
                  <p className="mt-2 text-base text-[color:var(--ink)]/80">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="card-shadow flex flex-col justify-between rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/60">
                Slate preview
              </p>
              <h2 className="font-display text-3xl text-[color:var(--ink)]">
                A slate with a clear top tier.
              </h2>
              <p className="text-sm text-[color:var(--navy)]/70">
                We score drama, momentum swings, and storylines first. Your
                favorites only nudge the ranking when the game delivers.
              </p>
            </div>
            <div className="mt-6 space-y-3">
              {[
                "Thunder at Timberwolves",
                "76ers at Knicks",
                "Bulls at Cavaliers",
              ].map((matchup) => (
                <div
                  key={matchup}
                  className="flex items-center justify-between rounded-2xl border border-[color:var(--navy)]/10 bg-white/70 px-4 py-3 text-sm font-medium text-[color:var(--ink)]"
                >
                  <span>{matchup}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-[color:var(--orange)]">
                    Watch
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
