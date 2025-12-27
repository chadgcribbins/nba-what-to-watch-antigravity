PRD v1.0: Spoiler-Free NBA Watchability Web App

0) Doc Meta

	•	Author: Chad Cribbins
	•	Date: 2025-12-20
	•	Status: Draft v1.0
	•	Stakeholders: Product, Design, Engineering
	•	Launch Target: Friends MVP (Q1 2025), public launch timing TBD pending licensing review

⸻

1) One-liner

A mobile-first web app that lets NBA League Pass fans configure a personal "watchability" algorithm, then ranks the previous slate of NBA games with spoiler-free reasons and one-tap links to watch.

⸻

2) Problem & Context

Problem statement

NBA League Pass fans wake up to multiple finished games with no spoiler-free way to decide what's worth watching. Existing recaps reveal scores, winners, and outcomes. Fans want a ranked list of watchable games with reasons, but current solutions either spoil everything or provide no guidance at all.

Evidence
	•	League Pass condensed games are designed for time-shifted viewing, but discovery is broken
	•	Social media, ESPN, and league apps immediately spoil outcomes
	•	Fans resort to manually avoiding scores while randomly picking games

Target behavior
	•	Users configure preferences once (teams, players, style), then get a daily ranked list
	•	Morning ritual: check the list, pick top games, start watching—zero spoilers
	•	Share lists with friends to spark debate and drive word-of-mouth growth

Jobs to Be Done

"When I wake up with League Pass, I want to know which games are worth watching and why, without any spoilers, so I can maximize my limited viewing time and enjoy the discovery experience."

⸻

3) Goals
	•	Help users decide what to watch each morning, fast, with zero spoilers.
	•	Make preference setup playful: drag team logos, drag player headshots, slide style knobs.
	•	Generate a ranked list of the previous slate plus a small Discovery section.
	•	Enable sharing a spoiler-free "my list" snapshot that sparks debate and drives new users to create their own profile.

Success Criteria (MVP)
	•	70%+ users complete preference setup
	•	60%+ daily return rate (users checking new slates regularly)
	•	40%+ share creation rate
	•	100% spoiler safety test pass rate (zero tolerance)
	•	<2% provider error rate
	•	Average 3+ games watched per slate per user

⸻

4) Non-goals (MVP)
	•	Streaming inside the app.
	•	Authentication required to use the product.
	•	Public launch licensing compliance (friends MVP only, flagged as a future risk).
	•	Multi-sport support.

⸻

5) Requirements (MVP scope)

Must-haves
	•	R1: User can configure team preferences (drag-and-drop ranking, weight selection)
	•	R2: User can configure player preferences (Must-See TV, Hooper, Villain, optional GOAT)
	•	R3: User can configure style preferences via sliders
	•	R4: System generates spoiler-free ranked list of previous slate games
	•	R5: Each game includes spoiler-safe tags, viewing suggestion, and watch link
	•	R6: User can share snapshot with spoiler-free headline
	•	R7: All outputs pass spoiler safety validation (whitelist + blocklist)

Nice-to-haves (V1)
	•	N1: Leaders tray with advanced stat categories (nerd toggle)
	•	N2: Profile export/import
	•	N3: User feedback loop ("Worth it" / "Skip" ratings)

Edge cases
	•	No games in slate window → show empty state with explanation
	•	Data provider unavailable → show cached previous slate with timestamp
	•	Deep link fails → fallback to web with clear messaging

⸻

6) Canonical definition: "previous slate"

Previous slate = all NBA games that became Final between the last cutoff and the current cutoff, in the user’s timezone.
	•	Default cutoff time: 07:30 local time
	•	Button “Run previous slate” uses the same rolling window, based on the current time.
	•	This avoids midnight edge cases, captures late West games, and naturally includes occasional afternoon games.

⸻

7) Target users
	•	NBA fans with League Pass who often watch condensed games, then switch to full late-game if it’s worth it.
	•	Friend groups who want a daily “what to watch” list without spoilers.

⸻

8) User stories
	•	As a user, I can rank teams by preference using drag-and-drop logos.
	•	As a user, I can view team ranking by League, Conference, or Division.
	•	As a user, I can assign players into buckets: Must-See TV, Hooper, Villain.
	•	As a user, I can select one 🐐 GOAT player (optional).
	•	As a user, I can pull players from a team roster dropdown, search by name, or drag season stat leaders into buckets.
	•	As a user, I can tune sliders for style (offense, pace, ball movement).
	•	As a user, I can save my profile locally and adjust it throughout the season.
	•	As a user, I can press “Run previous slate” to get a ranked list of all games.
	•	As a user, I can open a game in the NBA app (or web fallback).
	•	As a user, I can share a spoiler-free snapshot of my list that invites friends to disagree and create their own profile.

⸻

9) Key flows

A) Onboarding
	•	Welcome screen with “No Spoilers” pledge.
	•	Choose setup:
	•	Quick setup: team preference weight + style sliders
	•	Full setup: teams + players + sliders
	•	After setup: land on Home with “Run previous slate”.

B) Preferences: Teams

UI
	•	Toggle: League | Conference | Division
	•	League view: rank all 30 teams (drag list/grid)
	•	Conference view: two lists (East, West), rank within each
	•	Division view: six mini-lists, rank within each
	•	Team preference weight: Light / Medium / Strong (default Light)

Data model
	•	Always store a single canonical rank per team: teamRank[teamId] = 1..30
	•	Conference/Division views are filtered editors that write back to the same canonical list.

C) Preferences: Players

Buckets
	•	Must-See TV (I tune in on purpose)
	•	Hooper (fun, I respect it)
	•	Villain (lowers my joy, I root against you)
	•	Optional: 🐐 GOAT badge (exactly one player)

Player selection methods
	•	Team dropdown: shows roster headshot tiles
	•	Search: type player name, drag result into a bucket
	•	Leaders tray: season-to-date leaders as quick-add draggable tiles (no “last game” context)

Leaders tray categories
	•	MVP set: Points, Rebounds, Assists, Steals, Blocks, 3PT Made, FG%, 3PT%, FT%
	•	Fun add-ons: Turnovers, Minutes, Double-doubles, Triple-doubles, 40+ point games (season count), Games played
	•	Nerd toggle (V1): Usage rate, True shooting %, Assist/TO, OREB, DREB, Personal fouls, Charges drawn, Deflections, Season-only “clutch” style stats

D) Preferences: Style sliders

Sliders (0–100) with friendly labels:
	•	Offense-first ↔ Defense-first (default leans offense)
	•	Fast pace ↔ Slow pace
	•	Ball movement ↔ Isolation
	•	Star duels ↔ Team system
	•	Chaos swings ↔ Steady control
	•	Rivalry/rematch importance

E) Home: Run
	•	Big fun CTA button: Run previous slate
	•	Loading animation (NBA Jam-inspired vibe)
	•	Results page

F) Results
	•	Ranked list of all games in the slate, most watchable to least.
	•	Each game row includes:
	•	“Away at Home”
	•	2–4 spoiler-safe tags
	•	Viewing suggestion: condensed is enough | watch 4th quarter full | full game
	•	“Watch” button (NBA app link, fallback to web)
	•	Discovery section at the end:
	•	1–2 games that are good for learning rising talent
	•	Generic tags only, no player names

⸻

10) Spoiler policy and copy rules

Absolute bans
	•	Winners, scores, margins, numeric stats, stat lines
	•	Overtime or extra periods
	•	Outcome-revealing phrases: “buzzer beater”, “game winner”, “last-second”, “at the horn”, “walk-off”
	•	Standings movement: “clinched”, “eliminated”, “moved into seed”, “record implications”

Allowed vocabulary (whitelisted tag library)

Examples:
	•	tight finish, late drama, momentum swings, big comeback
	•	playoff-style intensity, physical, star duel vibe
	•	shootout feel, high tempo, ball movement showcase
	•	notable performance, memorable sequences (no numbers)

Implementation
	•	Tags and headings generated from a fixed whitelist and template library.
	•	Second-pass blocklist filter rejects forbidden terms.
	•	Automated tests include “red team” strings to catch leakage.

⸻

11) Ranking algorithm

Guiding principle

Personalisation should not overpower reality. The algorithm prioritizes objective game quality signals (drama, competitiveness, storylines) over personal preferences. User preferences act primarily as tiebreakers to keep recommendations credible and trustworthy.

A) Signals (internal)

Use a data provider to ingest or compute:
	•	Late-game tension proxy (play-by-play or win probability curve preferred)
	•	Lead changes and ties
	•	Comeback magnitude proxy
	•	Momentum swing proxy (runs)
	•	Pace proxy
	•	Offensive “shootout” proxy (internal, numbers allowed but never displayed)
	•	“Notable performance” flag (editorial signals or thresholds)
	•	Rivalry/rematch flag (optional)
	•	Blowout / non-competitive flag

B) Base Watchability Score (0–100)
	•	Competitiveness and late drama: 0–50
	•	Matchup quality and stakes: 0–30
	•	Highlights and storylines: 0–20
	•	Blowout penalty: meaningful negative adjustment that can pull a game down hard

C) Personalisation weights (locked)
	•	Team preference: Light tiebreaker only
	•	Player buckets:
	•	Must-See TV and 🐐 GOAT: small bonus only when the game already has a storyline/highlight reason
	•	Hooper: smaller bonus, same rule
	•	Villain: meaningful penalty (can push a game down even if otherwise decent)
	•	Villain penalty is not absolute, but a great game must be truly special to overcome it.

D) Discovery selection
	•	Select 1–2 games with strong “rising player” signals
	•	Output must not name the player(s), only generic tags:
	•	rising rookie, breakout wing, young star leap, new rotation piece

E) Viewing suggestion logic
	•	condensed is enough: low suspense games, or watchability driven mainly by moments
	•	watch 4th quarter full: games with strong late tension signals
	•	full game: rare, reserved for top-tier drama plus strong overall quality

⸻

12) Sharing and growth loop

What gets shared

A static snapshot of the previous slate ranking, tied to:
	•	the slate window (start cutoff to end cutoff)
	•	the profile used (name only, no full preference details unless added later)
	•	a timestamp

Share page contents
	•	Hero headline (spoiler-safe vibe sentence)
	•	Subtitle: “Spoiler-free games to watch”
	•	Slate label: “Slate window: [start] to [end] ([timezone])”
	•	Attribution: “Curated by Chad Cribbins”
	•	Cartoon avatar wearing the 🐐 jersey (based on profile theme)
	•	Ranked list
	•	CTA: “Disagree? Build your own profile.”

Spoiler-safe headline generator

Generate one sentence from slate-level aggregate signals, never outcomes. Example template families:
	•	intensity: “Playoff intensity starts to build.”
	•	chaos: “Momentum was not stable last night.”
	•	offense: “Shot-making season is officially here.”
	•	mixed: “A slate with a clear top tier.”

⸻

13) Tech stack (MVP)
	•	Mobile-first web app, PWA-friendly
	•	Framework: Next.js (or Remix) + TypeScript
	•	Package manager: pnpm
	•	Schema validation: Zod
	•	Validate third-party API responses
	•	Validate stored profile and shared snapshots
	•	Storage:
	•	Profile stored locally (IndexedDB preferred)
	•	Shared snapshots stored server-side (small DB or KV store) and served by ID
	•	Backend:
	•	Serverless functions for data fetching and normalisation (hide API keys)
	•	Canonical internal schema so providers can be swapped

⸻

14) Design & visual direction

Visual aesthetic
	•	Stylized cartoon take inspired by NBA Jam
	•	Traditional NBA palette with some vintage tones
	•	Playful, energetic vibe that makes checking "what to watch" feel fun, not like homework

Key UI elements
	•	Big, inviting "Run previous slate" button (primary CTA)
	•	Fun loading animation (NBA Jam-inspired energy)
	•	🐐 badge and playful micro-interactions throughout
	•	Cartoon avatar wearing the 🐐 jersey for share pages
	•	Draggable team logos and player headshots that feel tactile and responsive

Tone
	•	Confident, opinionated, and spoiler-safe
	•	Copy should feel like a friend helping you choose, not a robot listing facts

⸻

15) Data provider requirements

Provider must reliably support:
	•	Schedule, game IDs, final status timestamps
	•	Team and player mappings
	•	Ideally play-by-play or win probability style data for drama signals
	•	Season leaderboards for leaders tray categories

Recommended Options (easiest to hardest)

Option A: balldontlie.io (Recommended for MVP)
	•	Free, no API key required
	•	Schedule, scores, team/player data, season stats
	•	Limitation: No play-by-play data (will need to approximate drama signals from score data)
	•	Good for: Quick MVP validation

Option B: NBA Stats API (nba.com/stats)
	•	Free, unofficial but stable
	•	Box scores, play-by-play, advanced stats
	•	Requires reverse-engineering endpoints
	•	Good for: More sophisticated drama signals

Option C: SportsRadar API
	•	Paid, official, comprehensive
	•	Full play-by-play, win probability, official data
	•	Cost: ~$500-1000/month
	•	Good for: Post-MVP if revenue justifies

MVP Recommendation: Start with balldontlie.io, approximate drama signals using score proximity and lead changes inferred from quarter scores. Migrate to NBA Stats API in V1 if play-by-play needed.

⸻

16) Data model (simplified)
	•	Profile
	•	id, name, teamRank[teamId], teamWeight (Light/Med/Strong)
	•	playerBuckets: mustSee[], hooper[], villain[], goatPlayerId?
	•	sliders{}
	•	createdAt, updatedAt
	•	Game
	•	id, startTime, finalTime, awayTeamId, homeTeamId, links { nba, web }
	•	GameSignals
	•	gameId, drama, matchup, storylineFlags[], blowoutFlag, paceProxy, offenseProxy, discoveryFlag
	•	RankedResult
	•	profileId, windowStart, windowEnd, rankedGames[]
	•	ShareSnapshot
	•	shareId, profileDisplayName, windowStart, windowEnd, headlineTemplateId, rankedGames[], createdAt

⸻

17) Example: Spoiler-free daily output (human-readable)

Here's @Chad's spoiler-free watchability ranking for last night (Fri, Dec 19, 2025).

Date window (previous slate)
	•	Window start: 2025-12-19 07:30 (Europe/Lisbon)
	•	Window end: 2025-12-20 07:30 (Europe/Lisbon)

Games on the slate: Heat at Celtics, 76ers at Knicks, Spurs at Hawks, Bulls at Cavaliers, Thunder at Timberwolves.

Ranked: most watchable to least

1) Thunder at Timberwolves
	•	Tags: late drama, big momentum swing, playoff-style intensity, star takeover vibe
	•	Watch: watch 4th quarter full (or full game if you have time)
	•	Watch link: Open in NBA app

2) 76ers at Knicks
	•	Tags: high-energy matchup, guard-led pressure, physical, stretches of real tension
	•	Watch: condensed, then watch 4th quarter full
	•	Watch link: Open in NBA app

3) Bulls at Cavaliers
	•	Tags: offense-friendly, runs both ways, lead changes vibe, late push
	•	Watch: condensed, then switch to full late
	•	Watch link: Open in NBA app

4) Heat at Celtics
	•	Tags: shot-making showcase, momentum stretch, good bursts, more about highlights than suspense
	•	Watch: condensed is enough
	•	Watch link: Open in NBA app

5) Spurs at Hawks
	•	Tags: one-sided, not much suspense, fine as background, skip if time is tight
	•	Watch: condensed or skip
	•	Watch link: Open in NBA app

Discovery picks (no player names)
	•	Bulls at Cavaliers: rookie spotlight, new rotation piece
	•	76ers at Knicks: rising rookie, young guard impact

⸻

18) Canonical JSON structure (MVP)

This is the payload produced when a user presses "Run previous slate". All numeric scoring inputs are internal. This output contains NO spoilers.

```json
{
  "meta": {
    "generatedAt": "2025-12-20T07:31:10+00:00",
    "timezone": "Europe/Lisbon",
    "slateWindow": {
      "start": "2025-12-19T07:30:00+00:00",
      "end": "2025-12-20T07:30:00+00:00",
      "label": "Previous slate"
    },
    "profile": {
      "profileId": "local_8f3a",
      "displayName": "Chad Cribbins",
      "theme": {
        "style": "nba-jam-cartoon",
        "palette": "nba-vintage",
        "goatEnabled": true
      }
    },
    "spoilerPolicy": {
      "noScores": true,
      "noWinners": true,
      "noOvertimeMentions": true,
      "noOutcomePhrases": true,
      "discoveryNoPlayerNames": true
    }
  },
  "headline": {
    "text": "Playoff intensity starts to build.",
    "templateId": "headline_intensity_01"
  },
  "rankedGames": [
    {
      "rank": 1,
      "gameId": "nba_20251219_OKC_MIN",
      "matchup": {
        "awayTeamId": "OKC",
        "homeTeamId": "MIN",
        "display": "Thunder at Timberwolves"
      },
      "tags": ["late drama", "big momentum swing", "playoff-style intensity", "star takeover vibe"],
      "watchSuggestion": "watch_4q_full",
      "watchLinks": {
        "nbaAppUniversal": "https://www.nba.com/game/nba_20251219_OKC_MIN",
        "webFallback": "https://www.nba.com/game/nba_20251219_OKC_MIN"
      }
    },
    {
      "rank": 2,
      "gameId": "nba_20251219_PHI_NYK",
      "matchup": {
        "awayTeamId": "PHI",
        "homeTeamId": "NYK",
        "display": "76ers at Knicks"
      },
      "tags": ["high-energy matchup", "guard-led pressure", "physical", "stretches of real tension"],
      "watchSuggestion": "condensed_then_4q_full",
      "watchLinks": {
        "nbaAppUniversal": "https://www.nba.com/game/nba_20251219_PHI_NYK",
        "webFallback": "https://www.nba.com/game/nba_20251219_PHI_NYK"
      }
    },
    {
      "rank": 3,
      "gameId": "nba_20251219_CHI_CLE",
      "matchup": {
        "awayTeamId": "CHI",
        "homeTeamId": "CLE",
        "display": "Bulls at Cavaliers"
      },
      "tags": ["offense-friendly", "runs both ways", "lead changes vibe", "late push"],
      "watchSuggestion": "condensed_then_full_late",
      "watchLinks": {
        "nbaAppUniversal": "https://www.nba.com/game/nba_20251219_CHI_CLE",
        "webFallback": "https://www.nba.com/game/nba_20251219_CHI_CLE"
      }
    },
    {
      "rank": 4,
      "gameId": "nba_20251219_MIA_BOS",
      "matchup": {
        "awayTeamId": "MIA",
        "homeTeamId": "BOS",
        "display": "Heat at Celtics"
      },
      "tags": ["shot-making showcase", "momentum stretch", "good bursts", "highlights over suspense"],
      "watchSuggestion": "condensed_enough",
      "watchLinks": {
        "nbaAppUniversal": "https://www.nba.com/game/nba_20251219_MIA_BOS",
        "webFallback": "https://www.nba.com/game/nba_20251219_MIA_BOS"
      }
    },
    {
      "rank": 5,
      "gameId": "nba_20251219_SAS_ATL",
      "matchup": {
        "awayTeamId": "SAS",
        "homeTeamId": "ATL",
        "display": "Spurs at Hawks"
      },
      "tags": ["one-sided", "low suspense", "background viewing", "skippable"],
      "watchSuggestion": "condensed_or_skip",
      "watchLinks": {
        "nbaAppUniversal": "https://www.nba.com/game/nba_20251219_SAS_ATL",
        "webFallback": "https://www.nba.com/game/nba_20251219_SAS_ATL"
      }
    }
  ],
  "discovery": [
    {
      "gameId": "nba_20251219_CHI_CLE",
      "matchup": {
        "awayTeamId": "CHI",
        "homeTeamId": "CLE",
        "display": "Bulls at Cavaliers"
      },
      "tags": ["rookie spotlight", "new rotation piece"],
      "watchSuggestion": "condensed_then_4q_full",
      "note": "Discovery must not name players."
    },
    {
      "gameId": "nba_20251219_PHI_NYK",
      "matchup": {
        "awayTeamId": "PHI",
        "homeTeamId": "NYK",
        "display": "76ers at Knicks"
      },
      "tags": ["rising rookie", "young guard impact"],
      "watchSuggestion": "condensed_then_4q_full",
      "note": "Discovery must not name players."
    }
  ],
  "shareSnapshot": {
    "enabled": true,
    "shareId": "share_4b19c",
    "title": "Chad's Spoiler-Free Watch List",
    "subtitle": "Spoiler-free games to watch",
    "slateLabel": "Slate window: Dec 19, 07:30 to Dec 20, 07:30 (Europe/Lisbon)",
    "attribution": "Curated by Chad Cribbins",
    "cta": {
      "text": "Disagree? Build your own profile.",
      "action": "/onboarding"
    },
    "shareUrlPath": "/share/share_4b19c",
    "expiresAt": "2025-12-27T07:31:10+00:00"
  }
}
```

Watch suggestion values (enum)
	•	watch_4q_full: Watch 4th quarter full (or full game if you have time)
	•	condensed_then_4q_full: Watch condensed, then switch to 4th quarter full
	•	condensed_then_full_late: Watch condensed, then switch to full late
	•	condensed_enough: Condensed is enough
	•	condensed_or_skip: Condensed or skip

⸻

19) Analytics (light)

Primary metrics (success indicators)
	•	Daily active users (returning to check new slates)
	•	Completion rate: % users who complete preference setup
	•	Watch link click-through rate
	•	Share creation rate

Secondary metrics
	•	Average games watched per slate
	•	Profile customization depth (% using all three preference types)
	•	Time spent in preference configuration
	•	Share link open rate

Guardrail metrics
	•	Spoiler safety test pass rate (must be 100%)
	•	Provider error rate (target <1%)
	•	Deep link failure rate

Analytics events
	•	run_previous_slate_clicked
	•	profile_saved
	•	team_rank_changed (scope: league/conference/division)
	•	player_bucket_changed
	•	leaders_tile_dragged
	•	slider_changed
	•	watch_link_clicked
	•	share_created
	•	share_opened
	•	provider_error

Instrumentation plan
	•	Client-side event tracking via analytics SDK
	•	Events stored with timestamp, user session ID (anonymous), profile ID
	•	No PII collection; respect DNT headers
	•	Weekly data export for analysis during MVP

Review cadence
	•	Daily during first week post-launch
	•	Weekly during MVP phase (first 3 months)
	•	Bi-weekly after initial validation

⸻

20) Risks and mitigations
	•	Spoiler leakage: whitelist tags + blocklist + test suite
	•	Provider instability: normalise schema, cache results, provider fallback option
	•	Deep link drift: use https universal links first, always keep web fallback
	•	Licensing for public launch: flagged as required for any wider release

⸻

21) Testing strategy

Spoiler Safety Testing (Critical)
	•	Automated test suite with "red team" strings (scores, winners, "buzzer beater", "overtime", etc.)
	•	100% pass rate required before any launch
	•	Tests run on every tag generation and headline creation
	•	Manual review of all whitelisted tags before adding to library

Core Flow Testing
	•	Manual testing of all key flows (Sections 9A-F)
	•	Onboarding: Quick setup and Full setup paths
	•	Preference configuration: Teams (all 3 views), Players (all buckets), Sliders
	•	Run previous slate: Empty state, single game, full slate
	•	Share flow: Create, view, CTA functionality

Integration Testing
	•	Data provider: Schedule fetch, game data, player stats, leaderboards
	•	Deep links: iOS NBA app, Android NBA app, web fallback
	•	Local storage: Profile save/load, preference updates persist
	•	Export: Share snapshot generation, markdown format

Friends MVP = Beta Test
	•	10-20 initial users (NBA League Pass subscribers)
	•	Daily usage for 2 weeks
	•	Feedback collected via quick survey after each slate
	•	Focus areas: Spoiler safety validation, ranking quality, share behavior

⸻

22) MVP scope, V1, V2

MVP (friends)
	•	Preferences: teams (with scope toggle), players (3 buckets + 🐐), sliders
	•	Leaders tray (MVP set + fun add-ons)
	•	Local profile (single, evolving throughout season)
	•	Run previous slate results + Discovery section
	•	Watch links (NBA app if possible, web fallback)
	•	Share snapshot page with headline + CTA
	•	Spoiler safety system

V1
	•	"More leaders" nerd toggle
	•	Profile export/import (share your setup with friends)
	•	Simple feedback loop: "Worth it" / "Skip" to tune weights locally
	•	Profile customization themes (visual personalization, not separate profiles)

V2
	•	Optional auth + sync
	•	Notifications (daily digest)
	•	Multi-sport exploration only if NBA is a hit

⸻

23) Implementation decisions (validated)

Villain penalty strength
	•	Villain presence: -15 points to watchability score (out of 100)
	•	Exception: If game base score >85, penalty reduced to -5 (great games still rise)
	•	Tune based on friends MVP feedback

Drama signals (using balldontlie.io for MVP)
	•	Final margin as primary proxy:
	•	≤5 points = high drama (+30 points)
	•	6-10 points = medium drama (+15 points)
	•	>20 points = blowout penalty (-20 points)
	•	Quarter score analysis for comeback detection:
	•	Trailing in Q3 but won = comeback bonus (+10 points)
	•	Migrate to play-by-play data (NBA Stats API) in V1 for sophisticated signals

"Full game" recommendation thresholds
	•	Full game: Watchability score 90+ (top ~5% of games)
	•	4th quarter full: Score 70-89 (top ~20%)
	•	Condensed is enough: All others

Profile approach (decision: single profile)
	•	One profile per user that evolves throughout the season
	•	Encourage ongoing adjustment: tweak sliders, add players, rerank teams
	•	Make profile editing fun and rewarding (not a one-time setup)
	•	No multiple profile support in MVP or V1 (defer to V2 only if clear need emerges)

Deep-link behavior
	•	Use universal HTTPS links (e.g., watch.nba.com/game/{gameId})
	•	NBA app intercepts if installed; browser fallback otherwise
	•	Test on iOS Safari and Android Chrome during development
	•	Document fallback in user-facing copy

Headline generator templates
	•	5-7 pre-written templates mapped to slate signals:
	•	High drama avg → "Playoff intensity starts to build"
	•	High variance → "Momentum was not stable last night"
	•	High scoring → "Shot-making season is officially here"
	•	Manual review all templates before launch
	•	Collect feedback in friends MVP: "Was this headline helpful?" yes/no
