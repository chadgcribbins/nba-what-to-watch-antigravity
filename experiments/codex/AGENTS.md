# AGENTS.md

## Quick context
- What this repo is: spoiler-free NBA watchability web app. Codex work happens in `/Users/chadcribbins/GitHub/NBA/Codex/`.
- Primary goal of changes: ship features safely, keep tests green, avoid spoilers.

## Project map
- Key folders:
  - `/Users/chadcribbins/GitHub/NBA/Codex/`: Codex working area (build here).
  - `/Users/chadcribbins/GitHub/NBA/PRD.md`: product requirements.
  - `/Users/chadcribbins/GitHub/NBA/Research.md`: research notes.
  - `/Users/chadcribbins/GitHub/codex-demo-pm/tdd-demo-materials-ORIGINAL/`: reference only (do not copy).
- Entry points:
  - `/Users/chadcribbins/GitHub/NBA/Codex/AGENTS.md`: working rules and constraints.
  - TBD: app entry point once scaffolded.

## Setup commands
- Install deps: TBD (no app scaffolded in `/Users/chadcribbins/GitHub/NBA/Codex/` yet).
- Run dev: TBD.
- Run tests: TBD.
- Run lint/typecheck: TBD.
- Build: TBD.

## Working rules
- Ask before editing outside `/Users/chadcribbins/GitHub/NBA/Codex/`.
- If work needs to land in another project (e.g., `/Users/chadcribbins/GitHub/NBA/Antigravity/`), confirm the target first.
- Allow lockfiles when scaffolding the app in `/Users/chadcribbins/GitHub/NBA/Codex/` (pnpm preferred).
- Make the smallest safe change first.
- Prefer editing existing patterns over introducing new ones.
- If you change behavior, add or update tests.
- Call out spoilers and edge cases explicitly.

## Product constraints (from PRD)
- Absolute spoiler bans: scores, winners, margins, overtime, outcome phrases.
- Only output spoiler-safe tags from a controlled whitelist; apply a blocklist filter.
- "Previous slate" uses a rolling 07:30 local-time cutoff window.
- Personalization is a light tiebreaker; objective game quality signals dominate.

## MVP build preferences
- Web app, mobile-first; playful NBA Jam-inspired vibe.
- Stack: Next.js + TypeScript (preferred), Zod for schema validation.
- Data provider: start with `balldontlie.io` (approximate drama signals from score data).
- Profiles stored locally (IndexedDB preferred); share snapshots stored server-side by ID.

## Code style
- Language: TypeScript (preferred).
- Formatting: follow repo config once scaffolded.
- Conventions:
  - Keep naming consistent with existing modules.
  - Avoid adding new style rules without config support.
- Example snippet (from `/Users/chadcribbins/GitHub/NBA/Antigravity/src/lib/safety/spoilers.ts`):

```ts
export const SPOILER_BLOCKLIST = [
    // Scores and numbers
    /\d+-\d+/, // Score pattern like 110-108
    /won by/,
    /lost by/,
    /margin/,
    /score of/,
];
```
