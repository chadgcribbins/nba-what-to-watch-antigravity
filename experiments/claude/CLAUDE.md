# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **spoiler-free NBA watchability app** - a mobile-first web app that helps NBA League Pass fans decide which games are worth watching without revealing any scores, winners, or outcomes. This folder contains the Claude Code agent experiment for building and iterating on this product.

**Core Product Concept**: Users configure personal preferences (teams, players, viewing style), then get a daily ranked list of the previous slate's games with spoiler-free reasons and viewing suggestions.

**Critical Constraint**: Absolute spoiler-free guarantee. No scores, winners, overtime mentions, or outcome-revealing language anywhere in the app.

## Repository Architecture

### Core Structure (Parent: `/NBA/`)
- `Research.md` - Product discovery notes, constraints, and key decisions
- `PRD.md` - Full product requirements document (v1.0)
- `Claude/` - This experiment folder (Claude Code agent)
- `Codex/` - Codex experiment folder
- `Antigravity/` - Antigravity experiment folder

### Claude Experiment Structure
- `.claude/agents/` - Specialized agents for different workflows
- `.claude/commands/` - Custom commands for common tasks
- `docs/writing-styles/` - Style guides for different documentation types
- `CLAUDE.md` - This file

## Product Context

### The Problem
NBA fans wake up to multiple finished games with no spoiler-free way to decide what's worth watching. Current solutions either spoil everything or provide no guidance.

### Target Users
- NBA League Pass subscribers
- Fans who watch condensed games, then switch to full late-game viewing if it's worth it
- Friend groups who share watchability lists without spoilers

### Key Product Features (MVP)
1. **Preference Configuration**
   - Team ranking (drag-and-drop, with League/Conference/Division views)
   - Player bucketing (Must-See TV, Hooper, Villain, optional GOAT)
   - Style sliders (offense/defense, pace, ball movement, etc.)

2. **Daily Ranked List**
   - Spoiler-free tags for each game
   - Viewing suggestions: "condensed is enough" | "watch 4th quarter full" | "full game"
   - One-tap watch links to NBA app/web

3. **Discovery Section**
   - 1-2 games good for learning rising talent
   - Generic tags only, no player names

4. **Sharing**
   - Share snapshot with spoiler-free headline
   - Invite friends to "disagree and build your own profile"

## Spoiler-Free Rules (LOCKED - Never Violate)

### Absolute Bans
- Winners, scores, margins, numeric stats, stat lines
- Overtime or extra periods
- Outcome-revealing phrases: "buzzer beater", "game winner", "last-second", "at the horn", "walk-off"
- Standings movement: "clinched", "eliminated", "moved into seed"

### Allowed Vocabulary (Whitelist)
- "tight finish", "late drama", "momentum swings", "big comeback"
- "playoff-style intensity", "physical", "star duel vibe"
- "shootout feel", "high tempo", "ball movement showcase"
- "notable performance", "memorable sequences" (no numbers)

### Implementation Requirements
- All tags generated from fixed whitelist template library
- Second-pass blocklist filter to catch forbidden terms
- Automated test suite with "red team" spoiler strings

## Key Product Decisions (Locked from Research)

1. **Previous Slate Definition**: Rolling cutoff window (default 07:30 local time)
2. **Personalization Philosophy**: Preferences are tiebreakers, not overrides. Objective game quality signals come first.
3. **Favorite Player Rule**: Only boosts games when there's a storyline, not just because they played
4. **Villain Penalty**: Meaningful - can push down even good games unless truly exceptional
5. **Discovery Output**: Generic tags only, never name players
6. **Share First, Not Profile**: Share ranked game snapshots to spark debate
7. **No Auth MVP**: Build with future auth in mind, but not required initially

## Tech Stack (from PRD)

### Core Technologies
- **Framework**: Next.js (or Remix) + TypeScript
- **Package Manager**: pnpm
- **Schema Validation**: Zod (for API responses and profile persistence)
- **Storage**: IndexedDB for profiles (MVP), server KV store for share snapshots
- **Backend**: Serverless functions for data fetching, canonical schema for provider-agnostic data

### Design Aesthetic
- Stylized cartoon take inspired by NBA Jam
- Traditional NBA palette with vintage tones
- Fun animations, playful micro-interactions
- GOAT badge and big "Run previous slate" button

## 3-Agent Workflow for NBA App

### Research Agent
- **Tools**: Read, Grep, Glob, WebSearch, WebFetch
- **Purpose**: Gather NBA data APIs, understand League Pass deep-linking, research spoiler-free UX patterns
- **Output**: Technical research docs, API comparison, feasibility notes

### Planning & Architecture Agent
- **Tools**: Read, Edit, PRD/Research docs
- **Purpose**: Break down PRD into implementation phases, design data models, plan component architecture
- **Output**: Implementation plan, data schemas, component hierarchy, phased approach

### Implementation Agent
- **Tools**: Read, Edit, Write, Bash, Grep, Glob
- **Purpose**: Build working MVP following the plan
- **Output**: Functional prototype with preference config, ranking algorithm, spoiler-free UI

## Development Best Practices

### Spoiler Safety First
- ALWAYS validate output against spoiler blocklist
- Test every user-facing string with red team scenarios
- Build spoiler validation into CI/CD pipeline
- When in doubt, use more generic language

### Mobile-First Development
- Design for thumb-friendly interactions
- Optimize for quick morning check-in ritual
- Keep "Run previous slate" button prominent and accessible
- Test on actual mobile devices frequently

### Data Provider Abstraction
- Keep NBA data provider swappable
- Use canonical internal schema
- Never expose provider-specific data structures to UI
- Document data normalization layer clearly

### Preference Configuration UX
- Make drag-and-drop feel tactile and fun
- Show visual feedback for all interactions
- Save preferences automatically (no explicit "Save" button unless complex)
- Allow quick edits without full reconfiguration

### Algorithm Development
- Start with simple heuristics, iterate based on real game data
- Keep personalization weights light (tiebreaker philosophy)
- Document all scoring components and weights
- Build tuning dashboard for testing different weights

## Available Custom Agents

Located in `.claude/agents/`:
- `research-synthesizer.md` - For gathering and synthesizing research
- `planning-prd-agent.md` - For breaking down PRD into implementation steps
- `frontend-developer.md` - For building UI components
- `ui-designer.md` - For design decisions and component structure
- `engineer-review-agent.md` - For code review and quality checks
- `designer-review-agent.md` - For UX/UI review
- `executive-review-agent.md` - For product decision review

## Available Custom Commands

Located in `.claude/commands/`:
- `prd.md` - PRD generation and editing workflows
- `meeting-notes.md` - Meeting summary and action items
- `customer-summary.md` - Customer feedback synthesis
- `release-announcement.md` - Feature announcement drafting
- `get-time.md` - Utility for timestamp management

## Common Development Workflows

### Starting a New Feature
1. Review relevant section in PRD.md
2. Check Research.md for locked decisions
3. Use planning agent to break down into tasks
4. Implement with spoiler-safety validation
5. Test on mobile viewport
6. Review against design aesthetic

### Adding New Spoiler-Safe Tags
1. Check against allowed vocabulary list
2. Add to whitelist template library
3. Run blocklist filter validation
4. Add test case to red team suite
5. Document in tag taxonomy

### Tuning the Algorithm
1. Document current weights and logic
2. Identify games that ranked poorly
3. Analyze which signals were missing or wrong
4. Adjust weights incrementally
5. Test against full slate of real games
6. Document changes and rationale

## Testing Priorities

### Must-Test Scenarios
- Spoiler leakage in all user-facing strings
- Preference configuration on mobile (touch targets, drag-and-drop)
- Deep-link behavior to NBA app (iOS and Android)
- Share page rendering and metadata
- Algorithm credibility (are recommendations trustworthy?)

### Edge Cases
- No games in slate window
- Data provider unavailable
- All games are blowouts
- User has no preferences set
- Share snapshot for old slate

## Success Metrics

### Product Success
- Daily active users returning for new slates
- Preference completion rate
- Watch link click-through rate
- Share creation and open rates

### Technical Success
- Spoiler safety test pass rate: 100%
- Mobile performance: <2s to ranked results
- Provider error rate: <1%
- Deep-link success rate: >90%

## Version Control Best Practices

- Commit frequently with clear, descriptive messages
- Never commit API keys or secrets
- Use feature branches for significant changes
- Keep commits focused on single concerns
- Document breaking changes in commit messages

## Important Notes

- This is an experimental folder - iterate fast, learn quickly
- Compare approaches with Codex and Antigravity experiments
- Document learnings and surprises as you go
- The spoiler-free constraint is non-negotiable - it's the core product value
- Favor simple, working solutions over perfect architecture in MVP
