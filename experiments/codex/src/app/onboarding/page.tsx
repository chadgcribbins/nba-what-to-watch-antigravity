const setupOptions = [
  {
    title: "Quick setup",
    subtitle: "Teams + style sliders",
    description:
      "Rank a few squads, nudge the style sliders, and get your list in under two minutes.",
    highlights: ["Team weight", "Style sliders", "Skip players"],
    cta: "Start quick setup",
  },
  {
    title: "Full setup",
    subtitle: "Teams + players + style",
    description:
      "Drag favorite players into buckets and name your villain before the slate drops.",
    highlights: ["Player buckets", "GOAT badge", "Villain penalty"],
    cta: "Go full scout",
  },
] as const;

export default function OnboardingPage() {
  return (
    <div className="app-shell">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col gap-12 px-6 py-12 md:px-12">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--navy)] text-[color:var(--paper)]">
              <span className="font-display text-2xl">NS</span>
            </div>
            <div>
              <p className="font-display text-2xl">No Spoilers</p>
              <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--navy)]/70">
                Build your watch profile
              </p>
            </div>
          </div>
          <a
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/60"
            href="/"
          >
            Back to run
          </a>
        </header>

        <section className="grid gap-8">
          <div>
            <h1 className="font-display text-5xl leading-[0.95] text-[color:var(--ink)] md:text-6xl">
              Set your watchability DNA.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[color:var(--navy)]/80">
              Choose the setup depth you want. You can always adjust teams,
              players, and style sliders later.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {setupOptions.map((option) => (
              <div
                key={option.title}
                className="card-shadow flex flex-col justify-between rounded-3xl border border-[color:var(--navy)]/10 bg-[color:var(--paper)] p-6"
              >
                <div className="space-y-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--orange)]">
                    {option.subtitle}
                  </p>
                  <h2 className="font-display text-3xl text-[color:var(--ink)]">
                    {option.title}
                  </h2>
                  <p className="text-sm text-[color:var(--navy)]/70">
                    {option.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {option.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className="rounded-full border border-[color:var(--navy)]/20 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--navy)]/70"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-[color:var(--navy)] px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--paper)] transition hover:-translate-y-0.5 hover:bg-[color:var(--ink)]"
                  href="/preferences"
                >
                  {option.cta}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-[color:var(--navy)]/10 bg-white/70 p-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--navy)]/60">
                Spoiler safety pledge
              </p>
              <p className="mt-2 text-base text-[color:var(--ink)]/80">
                We never show scores, winners, or outcome language. Every tag is
                vetted against a whitelist and a blocklist before it reaches you.
              </p>
            </div>
            <a
              className="inline-flex items-center justify-center rounded-full border border-[color:var(--orange)]/50 bg-[color:var(--paper)] px-6 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[color:var(--orange)]"
              href="/results"
            >
              I trust the feed
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
