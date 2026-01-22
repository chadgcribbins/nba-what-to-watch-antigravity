# NBA Watchability App

A spoiler-free NBA League Pass companion that ranks games by watchability without revealing scores.

## Overview

**One-liner:** A mobile-first web app that lets NBA League Pass fans configure a personal "watchability" algorithm, then ranks the previous slate of NBA games with spoiler-free reasons and one-tap links to watch.

## Problem

NBA League Pass fans wake up to multiple finished games with no spoiler-free way to decide what's worth watching. Existing recaps reveal scores, winners, and outcomes.

## Solution

A ranked list of watchable games with spoiler-free reasons:
- Configure your personal preferences (favorite teams, play styles, etc.)
- Get AI-powered rankings of yesterday's games
- See why each game is worth watching (without spoilers)
- One-tap links directly to League Pass

## Project Status

🚧 **Active Development** - December 2024

## Structure

```
NBA/                        Core codebase (Antigravity / Gemini)
├── PRD.md                  Product requirements
├── Research.md             User research and insights
├── experiments/
│   ├── claude/             Alternate implementation (Claude)
│   └── codex/              Alternate implementation (Codex)
└── src/                    App source
```

## Tech Stack

- Next.js / React
- NBA API integration
- League Pass deep linking
- AI-powered game analysis

## Deployment

**Status:** In development
**Target:** Vercel deployment for friends MVP (Q1 2025)

## Related Links

- PRD: [View PRD.md](./PRD.md)
- Research: [View Research.md](./Research.md)

---

**Category:** Playground / Personal Project
**Author:** Chad Cribbins
**Started:** December 2024
