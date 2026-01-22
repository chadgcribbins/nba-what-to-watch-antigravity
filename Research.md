# Research Notes: Spoiler-Free NBA Watchability App

Date: 2025-12-20  
Context: This document summarizes the discovery, constraints, and product decisions from the discussion that led to the PRD for a mobile-first web app that ranks NBA games to watch without spoilers.

---

## 1) The core problem

NBA fans who have League Pass wake up to multiple games already finished. They want help deciding which games are worth watching, but most recaps spoil outcomes (scores, winners, and even subtle signals like overtime or buzzer-beater language).

The product goal is to recommend what to watch while preserving the experience of discovery. The output must be actionable (what to watch, in what order, and how to watch it) while remaining spoiler-free.

---

## 2) The spoiler-free constraint is stronger than typical

The user requirement is strict: do not reveal outcomes, and avoid even indirect spoilers.

### Explicit spoiler bans (locked)
- No winners, scores, margins, or numeric stat lines.
- Do not mention overtime or extra periods.
- Avoid outcome-revealing phrases such as:
  - "buzzer beater", "game winner", "last-second shot", "at the horn"
  - "won on", "clinched", "eliminated"
- Avoid standings movement language or record-implication phrasing.
- Prefer broad descriptors that convey watchability but not the result.

### Allowed language examples
- "late drama", "tight finish", "momentum swings", "big comeback"
- "playoff-style intensity", "shootout feel", "ball movement showcase"
- "notable performance", "memorable sequences" (no numbers)

This implies the app needs a whitelist tag library and a blocklist safety filter to prevent accidental leakage.

---

## 3) What makes a game "watchable"

The conversation converged on a watchability model made of three main components:

1) Competitiveness and late drama  
   - close finish energy, momentum swings, comeback feel
   - high tension late-game possessions

2) Matchup quality and stakes  
   - stronger teams playing each other
   - style clashes (elite offense vs elite defense)
   - rivalry/rematch energy

3) Highlights and storylines  
   - standout performances or milestones
   - memorable sequences

Plus:
- Blowouts should be heavily penalized to avoid wasting time on low-suspense games.

The key insight: most of the signal comes from game shape and drama, not from fan preferences.

---

## 4) Personalisation philosophy

### Personalisation should not overpower reality
We agreed personal preferences should generally be a tiebreaker so the list stays credible.

### Team preferences
- Users can rank teams, but weighting should be light by default.
- Team preference matters most in borderline cases.

### Player preferences evolve into 3 emotional buckets
Instead of A/B/C/D, the app uses:
- Must-See TV: "I tune in on purpose."
- Hooper: "I respect it, fun to watch."
- Villain: "Great or not, I root against you and it lowers my joy."

Also:
- Optional 🐐 GOAT pick, a single player you love more than anyone.

### Important rule for favorites (locked)
Favorite players should not automatically boost a game just because they played.
They should only influence ranking when something "interesting" happened in that game (storyline/highlights), described in spoiler-safe terms.

### Villain penalty
Unlike favorites, Villain should apply a meaningful penalty:
- Even if a game is good, a Villain-heavy game should be pushed down unless the game is truly exceptional.
- This reflects real fan behavior: some games are not worth it if you do not enjoy the characters involved.

---

## 5) Discovery mode

A key feature: help users learn new players and storylines without requiring them to already know names.

### Discovery output rules (locked)
- Include a small Discovery section in daily results (1–2 games).
- Do not name players in Discovery.
- Use generic tags: "rising rookie", "breakout wing", "young star leap", "new rotation piece".

This avoids spoilers and still nudges curiosity.

---

## 6) Viewing behavior and output format

The user’s viewing habit:
- Usually watches condensed games until late, then switches to full late-game viewing.
- Therefore, each recommended game should include a viewing suggestion:
  - "condensed is enough"
  - "watch 4th quarter full"
  - "full game"

Output must be actionable and fast to scan.

---

## 7) Defining “last night’s slate”

There is no canonical NBA-wide “last night” definition due to:
- time zones
- games that end after midnight local time
- occasional afternoon games

### Recommended definition (locked)
Use a rolling cutoff window tied to the daily digest time:
- Previous slate = all games that became final between the last cutoff and current cutoff.
- Default cutoff time: 07:30 local time.

This definition feels right for “what happened while I slept,” globally.

---

## 8) Sharing strategy and growth loop

Instead of sharing a profile first, share the output:
- Share a spoiler-free snapshot of “my ranked games to watch” for that slate window.
- The share artifact is timestamped, tied to that date/time window.

The growth loop:
- The shared list is opinionated, so it invites disagreement.
- CTA: “Disagree? Build your own profile.”
- This sparks debate in group chats and drives new users to configure preferences.

The share page also includes:
- A short, provocative headline that summarizes the slate vibe without spoilers.
  Example: “Playoff intensity starts to build.”
- A cartoon avatar in a stylized NBA Jam vibe, wearing the 🐐 jersey.

The headline must be generated from safe slate-level descriptors only, never outcomes.

---

## 9) Product configuration UI concepts

### Teams
Team ranking should support a scope toggle:
- League | Conference | Division

This makes ranking more fun and less overwhelming.

Important: internally store a canonical 1–30 ranking regardless of view.

### Players
Player selection methods:
- Team dropdown showing roster headshots to drag into buckets
- Search by name
- Stat leaders tray to quickly drag notable players into buckets

### Stat leaders tray
Include key season-to-date leader categories, including 3PT.
MVP set:
- Points, Rebounds, Assists, Steals, Blocks, 3PT made
- FG%, 3PT%, FT%

Nice-to-have fun leaders:
- Turnovers, Minutes
- Double-doubles, Triple-doubles
- 40+ point games (season count), Games played

Optional nerd section:
- True shooting %, usage, assist/TO, OREB/DREB, deflections, charges, etc.

Important: show season context only, not “last game” stats.

---

## 10) Tech and build constraints

Platform:
- Mobile-friendly web app (PWA-friendly)

Authentication:
- MVP without auth
- Build with future auth in mind (data model supports it later)

Data source:
- Not required to be an official NBA feed
- Use whatever is reliable and stable; keep provider swappable behind a canonical schema

Suggested stack additions:
- pnpm for package management
- Zod for runtime schema validation of external data and profile persistence

Design aesthetic:
- Stylized cartoon take inspired by NBA Jam
- Traditional NBA palette with some vintage tones
- Fun animations, big “Run previous slate” button
- 🐐 badge and playful micro-interactions

Licensing:
- For friends MVP, ignore official licensing concerns
- Flag it as a risk for any broader launch

---

## 11) Key locked decisions summary

- Strict no spoilers, including no mention of overtime.
- “Previous slate” uses rolling cutoff window (default 07:30 local).
- Daily output ranks all games, adds viewing suggestion per game.
- Discovery section exists, but does not name players.
- Team preference is light weighting.
- Favorites influence only when there’s a storyline.
- Villain carries meaningful penalty.
- Share output snapshots, not profiles (initially).
- Share includes a spoiler-safe vibe headline and strong CTA to build your own profile.
- Web app MVP, no auth required, provider-agnostic data approach.
- Stack includes pnpm and Zod.

---

## 12) Open areas for later testing

- Exact strength of the Villain penalty (tune against user feedback).
- Which signals best capture “late drama” without leaking spoilers.
- How frequently “full game” should be recommended (rare).
- Whether users want multiple profiles (regular season vs playoffs vs casual).
- Best deep-link behavior for NBA app across iOS and Android.