# NBA Spoiler-Free Watchability App: Implementation Plan

**Version:** 1.0
**Date:** 2025-12-20
**Author:** Architecture Planning (Claude)
**Target:** Friends MVP → V1 → V2

---

## Executive Summary

This implementation plan breaks down the NBA Spoiler-Free Watchability App into three phases:
1. **Phase 1 (MVP Core)**: Absolute minimum for first user testing - basic profile setup + daily slate ranking
2. **Phase 2 (MVP Complete)**: Full friends beta with sharing, discovery, and polish
3. **Phase 3 (V1)**: Post-MVP enhancements based on user feedback

**Critical Path:** Spoiler-safety validation system → Data provider abstraction → Profile management → Ranking algorithm → UI flows

---

## Quick Reference

### Phase Timeline
- **Phase 1 (MVP Core)**: Weeks 1-4
- **Phase 2 (MVP Complete)**: Weeks 5-6
- **Phase 3 (V1)**: Weeks 7-8+

### Critical Files to Create First
1. `/lib/data-providers/types.ts` - Canonical schema
2. `/lib/spoiler-safety/validator.ts` - Spoiler prevention
3. `/lib/schemas/profile.ts` - Profile data model
4. `/lib/ranking/game-scorer.ts` - Core algorithm
5. `/lib/slate/slate-generator.ts` - Main orchestrator

### Next Steps
1. Initialize Next.js project
2. Set up data provider layer
3. Build spoiler-safety system
4. Implement core ranking algorithm

---

## Table of Contents

1. [Critical Path Analysis](#1-critical-path-analysis)
2. [Phase Breakdown](#2-phase-breakdown)
3. [Architecture Decisions](#3-architecture-decisions)
4. [Data Flow Diagrams](#4-data-flow-diagrams)
5. [Testing Strategy](#5-testing-strategy)
6. [Critical Risks](#6-critical-risks)
7. [File Structure](#7-file-structure)
8. [Implementation Sequence](#8-implementation-sequence)
9. [Success Metrics](#9-success-metrics)
10. [Next Steps](#10-next-steps)

---

## 1. Critical Path Analysis

### What Must Be Built First

**Foundation Layer (Week 1-2):**
1. **Data Provider Abstraction** - Must be first to enable all other work
2. **Spoiler-Safety Validation System** - Non-negotiable, built alongside data layer
3. **Type System & Zod Schemas** - Foundation for type safety across app
4. **Local Storage Layer** - Profile persistence (IndexedDB)

**Core Features (Week 3-4):**
5. **Profile Management** - Teams/Players/Sliders configuration
6. **Ranking Algorithm** - Game scoring and ranking logic
7. **Slate Generation** - Main "Run Previous Slate" flow

**UI & Polish (Week 5-6):**
8. **Preference Configuration UI** - Drag-and-drop interactions
9. **Results Display** - Ranked list with tags and watch links
10. **Sharing System** - Snapshot generation and share pages

### Dependencies Diagram

```
Data Provider Abstraction
    ├─> Spoiler-Safety System
    ├─> Type System (Zod Schemas)
    └─> Local Storage Layer
            ├─> Profile Management
            │       └─> Preference Configuration UI
            └─> Ranking Algorithm
                    └─> Slate Generation
                            ├─> Results Display
                            └─> Sharing System
```

### Minimum Viable Feature Set (Friends Beta)

**Must Have:**
- Team preferences (drag-and-drop, League view only for MVP Core)
- Player preferences (3 buckets: Must-See TV, Hooper, Villain)
- Style sliders (basic set: 4 sliders minimum)
- Run previous slate button
- Ranked game list with 2-3 tags per game
- Watch links (web fallback only for MVP Core)
- Spoiler-safety tests (100% pass rate)

**Can Wait for Phase 2:**
- Conference/Division team views
- Leaders tray
- GOAT badge
- Discovery section
- Sharing functionality
- Deep linking to NBA app

**Can Wait for V1:**
- Advanced sliders
- Nerd toggle
- Profile export/import
- Feedback loop

---

## 2. Phase Breakdown

### Phase 1: MVP Core (Weeks 1-4)

**Goal:** Single user can configure basic preferences and get a ranked slate

#### Week 1: Foundation
- Initialize Next.js project with TypeScript
- Set up data provider abstraction layer
- Build spoiler-safety validation system
- Create Zod schemas for core data types

#### Week 2: Core Logic
- Implement IndexedDB storage layer
- Build profile management system
- Create ranking algorithm (game scorer, signal analyzer)
- Unit tests for all core logic

#### Week 3: Slate Generation & Basic UI
- Implement slate window calculator
- Build slate generator orchestrator
- Create home page and onboarding
- Basic results display

#### Week 4: Preference Configuration
- Team ranking UI (League view)
- Player bucket UI (manual search)
- Style sliders
- End-to-end testing

**Deliverable:** Single user can configure preferences and get ranked games

---

### Phase 2: MVP Complete (Weeks 5-6)

**Goal:** Full friends beta with sharing, discovery, and all preference features

#### Week 5: Advanced Preferences
- Conference/Division team views
- Leaders tray with stat categories
- Team roster dropdown
- GOAT badge UI
- Discovery section logic

#### Week 6: Sharing & Launch
- Sharing backend (API routes + KV store)
- Sharing frontend (creator + share page)
- Headline generator
- Deep linking
- Final testing and polish

**Deliverable:** Friends beta launch ready

---

### Phase 3: V1 (Weeks 7-8+)

**Goal:** Post-MVP improvements based on user feedback

#### Features
- Advanced leaders tray (nerd toggle)
- Profile export/import
- Feedback loop ("Worth it" / "Skip")
- Analytics integration
- Performance optimizations
- Bug fixes and refinements

**Deliverable:** V1 complete

---

## 3. Architecture Decisions

### 3.1 Component Structure

```
/app                          # Next.js App Router
  ├── page.tsx                # Home
  ├── onboarding/page.tsx     # Welcome
  ├── preferences/
  │   ├── teams/page.tsx      # Team ranking
  │   ├── players/page.tsx    # Player buckets
  │   └── style/page.tsx      # Sliders
  ├── results/page.tsx        # Ranked games
  ├── share/[id]/page.tsx     # Share view
  └── api/share/
      └── route.ts            # Share API

/lib                          # Business logic
  ├── data-providers/         # Data abstraction
  ├── spoiler-safety/         # Validation
  ├── schemas/                # Zod schemas
  ├── storage/                # IndexedDB
  ├── profile/                # Profile mgmt
  ├── ranking/                # Algorithm
  ├── slate/                  # Generation
  └── sharing/                # Share logic
```

### 3.2 State Management

**Architecture:**
- IndexedDB for persistence (profile, cached results)
- React Context for in-memory session state
- No backend state for MVP

**State Layers:**
```typescript
// Global App State
interface AppState {
  profile: Profile | null;
  currentSlateResult: RankedResult | null;
  isLoading: boolean;
}

// Profile Context
interface ProfileState {
  profile: Profile;
  updateTeamRank: (teamId: string, rank: number) => void;
  addPlayerToBucket: (playerId: string, bucket: PlayerBucket) => void;
  updateSlider: (slider: string, value: number) => void;
  save: () => Promise<void>;
}
```

### 3.3 Data Provider Abstraction

**Interface:**
```typescript
interface DataProvider {
  name: string;
  getGamesInWindow(start: Date, end: Date): Promise<Game[]>;
  getGameDetails(gameId: string): Promise<GameDetails>;
  getAllTeams(): Promise<Team[]>;
  getTeamRoster(teamId: string): Promise<Player[]>;
  getSeasonLeaders(category: StatCategory): Promise<PlayerStat[]>;
  ping(): Promise<boolean>;
}
```

**MVP:** balldontlie.io (free, no API key)
**V1:** NBA Stats API (for play-by-play)
**V2:** SportsRadar (if revenue justifies)

### 3.4 Spoiler-Safety System

**Three-Layer Defense:**

1. **Whitelist Tags** - Only use pre-approved tags
2. **Blocklist Filter** - Scan output for forbidden patterns
3. **Automated Testing** - Red team test suite (100% pass required)

```typescript
interface SpoilerValidator {
  validateTag(tag: string): SpoilerSafetyResult;
  validateHeadline(headline: string): SpoilerSafetyResult;
  validateGameCard(card: GameCard): SpoilerSafetyResult;
  runRedTeamTests(): TestResults;
}
```

---

## 4. Data Flow Diagrams

### Slate Generation Flow

```
User clicks "Run Previous Slate"
    ↓
SlateGenerator.generate()
    ↓
WindowCalculator → GameFetcher → SignalAnalyzer
    ↓
GameScorer → Personalizer → Ranker
    ↓
SpoilerValidator (100% pass required)
    ↓
RankedResult
    ↓
Cache to IndexedDB + Display in UI
```

### Profile Update Flow

```
User drags team in ranking
    ↓
ProfileContext.updateTeamRank()
    ↓
Profile object updated (in-memory)
    ↓
[Debounced] ProfileRepository.save()
    ↓
IndexedDB.put('profile', profile)
```

---

## 5. Testing Strategy

### Phase 1: MVP Core

**Spoiler-Safety Testing (Critical):**
```typescript
describe('Spoiler Validator', () => {
  it('rejects numeric scores', () => {
    expect(validator.validateTag('Warriors won 110-95'))
      .toHaveViolations();
  });

  it('rejects overtime mentions', () => {
    expect(validator.validateTag('went to overtime'))
      .toHaveViolations();
  });

  it('rejects outcome phrases', () => {
    expect(validator.validateTag('buzzer beater to win'))
      .toHaveViolations();
  });

  it('allows whitelisted tags', () => {
    expect(validator.validateTag('late drama'))
      .toBeValid();
  });
});
```

**Ranking Algorithm Testing:**
```typescript
describe('Game Scorer', () => {
  it('awards high score for close games', () => {
    const game = createMockGame({ finalMargin: 3 });
    const score = scorer.scoreGame(game);
    expect(score.baseScore).toBeGreaterThan(70);
  });

  it('penalizes blowouts', () => {
    const game = createMockGame({ finalMargin: 25 });
    const score = scorer.scoreGame(game);
    expect(score.baseScore).toBeLessThan(50);
  });
});
```

**Manual Testing Checklist:**
- [ ] Complete onboarding flow
- [ ] Drag-and-drop all 30 teams
- [ ] Add players to all buckets
- [ ] Adjust all sliders
- [ ] Run slate with games
- [ ] Run slate with no games (empty state)
- [ ] Verify zero spoilers in all output
- [ ] Test on mobile Safari and Chrome

---

## 6. Critical Risks

### 6.1 Spoiler Leakage
**Impact:** CRITICAL
**Mitigation:**
- Three-layer validation (whitelist + blocklist + tests)
- 100% test pass rate required
- Friends beta focused on spoiler validation

### 6.2 Data Provider Reliability
**Impact:** HIGH
**Mitigation:**
- Provider abstraction layer
- Caching previous results
- Clear error messaging

### 6.3 Algorithm Credibility
**Impact:** MEDIUM
**Mitigation:**
- Objective signals first
- Personalization as tiebreaker
- Beta testing and feedback

### 6.4 Mobile Performance
**Impact:** MEDIUM
**Mitigation:**
- Progressive enhancement
- Debounced saves
- Performance testing on target devices

---

## 7. File Structure

```
/Users/chadcribbins/GitHub/NBA/Claude/
├── /app                      # Next.js pages
│   ├── page.tsx              # Home
│   ├── /onboarding
│   ├── /preferences
│   │   ├── /teams
│   │   ├── /players
│   │   └── /style
│   ├── /results
│   ├── /share/[id]
│   └── /api/share
│
├── /components               # React components
│   ├── /ui                   # Base components
│   ├── team-ranker.tsx
│   ├── player-bucket.tsx
│   ├── slider-group.tsx
│   ├── game-card.tsx
│   └── watch-button.tsx
│
├── /lib                      # Business logic
│   ├── /data-providers
│   ├── /spoiler-safety
│   ├── /schemas
│   ├── /storage
│   ├── /profile
│   ├── /ranking
│   ├── /slate
│   └── /sharing
│
├── /contexts                 # React Context
│   ├── app-context.tsx
│   ├── profile-context.tsx
│   └── slate-context.tsx
│
├── /tests                    # Test suites
│   ├── /unit
│   └── /integration
│
└── /docs                     # Documentation
    ├── IMPLEMENTATION-PLAN.md
    ├── design-system.md
    └── API.md
```

---

## 8. Implementation Sequence

### Week 1: Foundation
**Days 1-2:** Project setup, dependencies, folder structure
**Days 3-4:** Data provider layer + mapper
**Day 5:** Spoiler-safety foundation + tests

### Week 2: Core Logic
**Days 1-2:** Storage layer (IndexedDB)
**Day 3:** Profile management
**Days 4-5:** Ranking algorithm + tests

### Week 3: Slate & Basic UI
**Day 1:** Slate generation
**Days 2-3:** Home, onboarding, results pages
**Days 4-5:** Team preference UI

### Week 4: Player Preferences & Polish
**Days 1-2:** Player bucket UI
**Day 3:** Style sliders
**Days 4-5:** Integration testing + bug fixes

### Week 5-6: Phase 2 Features
**Week 5:** Advanced preferences, discovery, deep linking
**Week 6:** Sharing system, final polish, beta launch

---

## 9. Success Metrics

### Phase 1 Completion
- [ ] 100% spoiler-safety test pass rate
- [ ] All core flows functional
- [ ] Profile persists across sessions
- [ ] Slate generation <5 seconds
- [ ] Zero crashes on test devices

### Friends Beta (Phase 2)
- [ ] 70%+ complete full setup
- [ ] 60%+ daily return rate
- [ ] 40%+ share creation rate
- [ ] 0 spoiler complaints
- [ ] <2% provider error rate

### V1 Success
- [ ] 70%+ daily return rate
- [ ] Average 4+ games watched per slate
- [ ] 30%+ use advanced features

---

## 10. Next Steps

### Immediate Actions

1. **Initialize Project**
```bash
cd /Users/chadcribbins/GitHub/NBA/Claude
pnpm create next-app . --typescript --tailwind --app
pnpm add zod @dnd-kit/core @dnd-kit/sortable
pnpm add -D vitest @testing-library/react
```

2. **Create Foundation Files**
- `/lib/data-providers/types.ts`
- `/lib/spoiler-safety/whitelist.ts`
- `/lib/spoiler-safety/validator.ts`
- `/lib/schemas/profile.ts`

3. **Set Up Testing**
- Configure Vitest
- Create test fixtures
- Write first spoiler-safety tests

4. **Build Data Provider**
- Implement balldontlie client
- Test endpoints
- Create mapper

---

## Open Questions

### Technical
1. **UI Component Library:** Recommendation: shadcn/ui
2. **Drag-and-Drop:** Recommendation: @dnd-kit
3. **KV Store:** Recommendation: Vercel KV or Upstash
4. **Analytics:** Recommendation: Plausible

### Product
1. **Quick vs Full Setup:** Phase 1 = Full only, Phase 2 = Add quick
2. **GOAT Badge:** Phase 2 (not critical for core)
3. **Watch Links:** Web-only Phase 1, deep linking Phase 2
4. **Villain Penalty:** Start with -15 points, tune in beta

---

## Summary

This implementation plan provides a clear path from foundation to friends beta to V1. The critical path prioritizes spoiler-safety, data abstraction, and ranking credibility. By following this phased approach, the team can deliver a working beta in 6 weeks and iterate based on real user feedback.

**The 5 most critical files to create first:**
1. `/lib/data-providers/types.ts`
2. `/lib/spoiler-safety/validator.ts`
3. `/lib/schemas/profile.ts`
4. `/lib/ranking/game-scorer.ts`
5. `/lib/slate/slate-generator.ts`

These represent the architectural backbone and should be designed carefully before building the UI.
