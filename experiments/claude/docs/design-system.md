# Design System & Component Architecture
## NBA Spoiler-Free Watchability App

**Version**: 1.0
**Date**: 2025-12-20
**Author**: UI/UX Design Team
**Status**: Final for Phase 1 & 2 Implementation

---

## Table of Contents

1. [Design Principles](#design-principles)
2. [Visual Language](#visual-language)
3. [Design Tokens](#design-tokens)
4. [Component Architecture](#component-architecture)
5. [Page Specifications](#page-specifications)
6. [Interaction Patterns](#interaction-patterns)
7. [Accessibility](#accessibility)
8. [Performance Guidelines](#performance-guidelines)

---

## 1. Design Principles

### Core Principles

1. **Spoiler-Free First**
   - Never reveal outcomes, scores, or game results
   - Use visual cues and language that build anticipation, not reveal results
   - All copy must pass spoiler safety validation

2. **Mobile-First & Thumb-Optimized**
   - Designed for morning check-in ritual on mobile devices
   - Primary actions in thumb zone (bottom 2/3 of screen)
   - Minimum touch targets: 44x44pt

3. **Playful Energy**
   - NBA Jam-inspired aesthetic: bold, cartoonish, energetic
   - Configuration feels like play, not homework
   - Tactile, responsive interactions

4. **Progressive Enhancement**
   - Core functionality works without JavaScript
   - Enhanced interactions layer on top
   - Fast initial load, then enrich

5. **Confidence & Personality**
   - Opinionated recommendations (not neutral lists)
   - Friendly, knowledgeable tone
   - Visual hierarchy guides decisions

---

## 2. Visual Language

### Aesthetic Direction

**NBA Jam Meets Vintage NBA**
- Stylized, cartoon-like illustrations
- Bold, energetic color palette
- Playful micro-interactions
- Retro-modern fusion

### Reference Mood

```
┌─────────────────────────────────────┐
│  NBA JAM INSPIRATION                │
├─────────────────────────────────────┤
│  - Big, bold typography             │
│  - Bright, saturated colors         │
│  - Cartoonish player representations│
│  - Energetic animations             │
│  - "On fire!" energy                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  VINTAGE NBA PALETTE                │
├─────────────────────────────────────┤
│  - Classic team colors              │
│  - 70s-80s warm tones               │
│  - Court wood textures (subtle)     │
│  - Hardwood classics vibe           │
└─────────────────────────────────────┘
```

---

## 3. Design Tokens

### 3.1 Color Palette

#### Primary Colors

```css
/* NBA Court */
--color-court-primary: #E64921;      /* Basketball orange - primary actions */
--color-court-dark: #C13B1A;         /* Dark orange - hover states */
--color-court-light: #FF6B4A;        /* Light orange - active states */

/* NBA Deep Blue */
--color-nba-blue: #1D428A;           /* NBA official blue - headers, accents */
--color-nba-blue-dark: #0F2555;      /* Dark blue - text, borders */
--color-nba-blue-light: #3D5FAA;     /* Light blue - hover states */

/* Vintage Hardwood */
--color-hardwood: #D4A574;           /* Court wood - warm backgrounds */
--color-hardwood-dark: #9B7653;      /* Dark wood - secondary elements */
--color-hardwood-light: #E8C9A3;     /* Light wood - subtle backgrounds */
```

#### Semantic Colors

```css
/* Neutrals */
--color-black: #1A1A1A;              /* Primary text */
--color-gray-900: #2D2D2D;           /* Secondary text */
--color-gray-800: #4A4A4A;           /* Tertiary text */
--color-gray-700: #6B6B6B;           /* Disabled text */
--color-gray-600: #8A8A8A;           /* Placeholder text */
--color-gray-400: #BDBDBD;           /* Borders */
--color-gray-300: #D9D9D9;           /* Dividers */
--color-gray-200: #E8E8E8;           /* Backgrounds */
--color-gray-100: #F5F5F5;           /* Subtle backgrounds */
--color-white: #FFFFFF;              /* White */

/* Feedback */
--color-success: #2D8A3E;            /* Success states */
--color-warning: #F5A623;            /* Warning states */
--color-error: #D32F2F;              /* Error states */
--color-info: #1976D2;               /* Info states */

/* Player Buckets */
--color-must-see: #FFD700;           /* Gold - Must-See TV */
--color-hooper: #4CAF50;             /* Green - Hooper */
--color-villain: #9C27B0;            /* Purple - Villain */
--color-goat: #FF6B6B;               /* Red - GOAT badge */

/* Game Quality Indicators */
--color-quality-high: #4CAF50;       /* Top-tier games */
--color-quality-medium: #FFA726;     /* Good games */
--color-quality-low: #78909C;        /* Skip-worthy games */
```

#### Gradients

```css
/* Primary Gradient (for CTA buttons) */
--gradient-primary: linear-gradient(135deg, #E64921 0%, #C13B1A 100%);

/* Court Gradient (for backgrounds) */
--gradient-court: linear-gradient(180deg, #D4A574 0%, #9B7653 100%);

/* Quality Gradient (for game cards) */
--gradient-quality-high: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
--gradient-quality-medium: linear-gradient(135deg, #FFA726 0%, #F57C00 100%);
```

### 3.2 Typography

#### Font Families

```css
/* Primary Font: Display & Headlines */
--font-display: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Secondary Font: Body & UI */
--font-body: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Monospace: Data & Codes */
--font-mono: 'SF Mono', 'Monaco', 'Consolas', monospace;
```

#### Type Scale

```css
/* Font Sizes */
--text-xs: 0.75rem;      /* 12px - captions, labels */
--text-sm: 0.875rem;     /* 14px - secondary text */
--text-base: 1rem;       /* 16px - body text */
--text-lg: 1.125rem;     /* 18px - large body */
--text-xl: 1.25rem;      /* 20px - small headings */
--text-2xl: 1.5rem;      /* 24px - headings */
--text-3xl: 1.875rem;    /* 30px - large headings */
--text-4xl: 2.25rem;     /* 36px - hero headings */
--text-5xl: 3rem;        /* 48px - display */

/* Line Heights */
--leading-tight: 1.2;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-black: 900;

/* Letter Spacing */
--tracking-tight: -0.025em;
--tracking-normal: 0;
--tracking-wide: 0.025em;
```

#### Typography Styles

```css
/* Display (Hero Headlines) */
.text-display {
  font-family: var(--font-display);
  font-size: var(--text-5xl);
  font-weight: var(--font-black);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

/* Heading 1 */
.text-h1 {
  font-family: var(--font-display);
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

/* Heading 2 */
.text-h2 {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

/* Heading 3 */
.text-h3 {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-normal);
}

/* Body Large */
.text-body-lg {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
}

/* Body */
.text-body {
  font-family: var(--font-body);
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}

/* Body Small */
.text-body-sm {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
}

/* Caption */
.text-caption {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

/* Button Text */
.text-button {
  font-family: var(--font-display);
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-wide);
}
```

### 3.3 Spacing System

```css
/* Base Unit: 4px */
--space-0: 0;
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */

/* Component Spacing */
--space-section: var(--space-12);      /* Between major sections */
--space-stack: var(--space-6);         /* Vertical stack */
--space-inline: var(--space-4);        /* Horizontal inline */
--space-card-padding: var(--space-6);  /* Card internal padding */
```

### 3.4 Sizing & Layout

```css
/* Container Widths */
--container-sm: 640px;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;

/* Touch Targets */
--touch-min: 44px;     /* Minimum touch target */
--touch-comfortable: 56px;  /* Comfortable touch target */

/* Border Radius */
--radius-sm: 4px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
--radius-2xl: 24px;
--radius-full: 9999px;

/* Borders */
--border-width-thin: 1px;
--border-width-medium: 2px;
--border-width-thick: 4px;

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

/* Z-Index Scale */
--z-base: 0;
--z-dropdown: 100;
--z-sticky: 200;
--z-modal-backdrop: 300;
--z-modal: 400;
--z-toast: 500;
--z-tooltip: 600;
```

### 3.5 Animation

```css
/* Timing Functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);  /* NBA Jam bounce */

/* Durations */
--duration-instant: 100ms;
--duration-fast: 200ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--duration-slower: 700ms;

/* Animation Presets */
--transition-default: all var(--duration-normal) var(--ease-in-out);
--transition-fast: all var(--duration-fast) var(--ease-out);
--transition-bounce: all var(--duration-normal) var(--ease-bounce);
```

---

## 4. Component Architecture

### 4.1 Component Hierarchy

```
App
├── Layout
│   ├── Header
│   │   ├── Logo
│   │   └── NavMenu (mobile)
│   ├── Main
│   │   └── [Page Content]
│   └── Footer
│
├── Pages
│   ├── HomePage
│   │   ├── WelcomeHero
│   │   ├── RunSlateButton (CTA)
│   │   └── QuickPreferences
│   │
│   ├── OnboardingPage
│   │   ├── WelcomeScreen
│   │   ├── SetupChoice
│   │   └── ProgressIndicator
│   │
│   ├── TeamPreferencesPage
│   │   ├── ViewToggle (League/Conference/Division)
│   │   ├── TeamRanking
│   │   │   ├── DraggableTeamList
│   │   │   │   └── TeamCard (draggable)
│   │   │   └── TeamGrid (League view)
│   │   └── WeightSelector
│   │
│   ├── PlayerPreferencesPage
│   │   ├── PlayerBuckets
│   │   │   ├── MustSeeBucket
│   │   │   ├── HooperBucket
│   │   │   ├── VillainBucket
│   │   │   └── GoatBadgeSelector
│   │   ├── PlayerSearch
│   │   ├── TeamRosterDropdown
│   │   └── LeadersTray
│   │       └── LeaderCard (draggable)
│   │
│   ├── StylePreferencesPage
│   │   ├── StyleSlider (x6)
│   │   └── LivePreview
│   │
│   ├── ResultsPage
│   │   ├── ResultsHeader
│   │   │   ├── Headline
│   │   │   └── SlateInfo
│   │   ├── RankedGameList
│   │   │   └── GameCard
│   │   │       ├── Matchup
│   │   │       ├── TagList
│   │   │       ├── ViewingSuggestion
│   │   │       └── WatchButton
│   │   ├── DiscoverySection
│   │   │   └── DiscoveryCard
│   │   └── ShareButton
│   │
│   └── SharePage
│       ├── ShareHeader
│       ├── ShareAttribution
│       ├── RankedGameList (read-only)
│       └── CTAButton
│
└── Shared Components
    ├── Button
    ├── Card
    ├── Slider
    ├── Tag
    ├── LoadingSpinner
    ├── EmptyState
    ├── DragHandle
    └── DropZone
```

### 4.2 Component Types

#### Container Components (Smart)
- Manage state
- Handle business logic
- Connect to data sources
- Coordinate child components

Examples: `TeamPreferencesPage`, `ResultsPage`, `PlayerBuckets`

#### Presentational Components (Dumb)
- Receive data via props
- Emit events via callbacks
- No business logic
- Highly reusable

Examples: `Button`, `Card`, `Tag`, `TeamCard`

---

## 5. Page Specifications

### 5.1 Home Page (`/app/page.tsx`)

#### Visual Hierarchy

```
┌──────────────────────────────────────┐
│  [Logo]                   [Menu ☰]   │
├──────────────────────────────────────┤
│                                      │
│        🏀 Welcome Back, Chad         │
│                                      │
│    Your watchability profile is      │
│         ready to run.                │
│                                      │
│  ┌────────────────────────────────┐  │
│  │                                │  │
│  │   RUN PREVIOUS SLATE           │  │
│  │                                │  │
│  └────────────────────────────────┘  │
│                                      │
│  Quick preferences:                  │
│  [Edit Teams] [Edit Players]         │
│                                      │
├──────────────────────────────────────┤
│  Footer: NBA Jam vibe                │
└──────────────────────────────────────┘
```

#### Components

**WelcomeHero**
```typescript
interface WelcomeHeroProps {
  userName?: string;
  hasProfile: boolean;
}

// Displays personalized welcome message
// If no profile, shows "Get Started" CTA instead
```

**RunSlateButton**
```typescript
interface RunSlateButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

// Primary CTA - large, prominent
// NBA Jam-inspired styling
// Shows loading animation when active
```

**QuickPreferences**
```typescript
interface QuickPreferencesProps {
  onEditTeams: () => void;
  onEditPlayers: () => void;
  onEditStyle: () => void;
}

// Quick access to preference pages
// Secondary buttons, smaller than CTA
```

#### Layout Specifications

```css
.home-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: var(--space-6);
  background: linear-gradient(
    180deg,
    var(--color-hardwood-light) 0%,
    var(--color-white) 50%
  );
}

.welcome-hero {
  text-align: center;
  margin-bottom: var(--space-12);
}

.run-button-container {
  margin-bottom: var(--space-10);
}

.quick-preferences {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
}
```

---

### 5.2 Onboarding Page (`/app/onboarding/page.tsx`)

#### Flow Diagram

```
┌─────────────────────────────────────┐
│  Step 1: Welcome                    │
│  - No spoilers pledge               │
│  - App value proposition            │
│  - [Continue] button                │
└─────────────────────────────────────┘
             ↓
┌─────────────────────────────────────┐
│  Step 2: Setup Choice               │
│                                     │
│  ┌────────────┐  ┌────────────┐    │
│  │  QUICK     │  │   FULL     │    │
│  │  SETUP     │  │   SETUP    │    │
│  │            │  │            │    │
│  │ ~2 min     │  │  ~5 min    │    │
│  └────────────┘  └────────────┘    │
│                                     │
└─────────────────────────────────────┘
             ↓
    ┌────────┴────────┐
    ↓                 ↓
┌─────────┐   ┌──────────────┐
│ Quick:  │   │ Full:        │
│ - Teams │   │ - Teams      │
│ - Style │   │ - Players    │
│         │   │ - Style      │
└─────────┘   └──────────────┘
    ↓                 ↓
    └────────┬────────┘
             ↓
    ┌────────────────┐
    │  Complete!     │
    │  → Home        │
    └────────────────┘
```

#### Components

**WelcomeScreen**
```typescript
interface WelcomeScreenProps {
  onContinue: () => void;
}

// Full-screen welcome
// "No Spoilers" pledge
// NBA Jam-inspired hero graphic
```

**SetupChoice**
```typescript
interface SetupChoiceProps {
  onQuickSetup: () => void;
  onFullSetup: () => void;
}

// Two-column choice cards
// Clear time estimates
// Different paths through onboarding
```

**ProgressIndicator**
```typescript
interface ProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

// Horizontal step indicator
// Shows progress through onboarding
// Sticky at top of page
```

#### Mobile Layout

```css
.onboarding-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.welcome-screen {
  padding: var(--space-8);
  text-align: center;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.setup-choice {
  padding: var(--space-6);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-4);
}

@media (min-width: 640px) {
  .setup-choice {
    grid-template-columns: 1fr 1fr;
  }
}

.progress-indicator {
  position: sticky;
  top: 0;
  background: var(--color-white);
  padding: var(--space-4);
  border-bottom: var(--border-width-thin) solid var(--color-gray-300);
  z-index: var(--z-sticky);
}
```

---

### 5.3 Team Preferences Page (`/app/preferences/teams/page.tsx`)

#### Visual Layout

```
┌──────────────────────────────────────┐
│  ← Back              Team Ranking    │
├──────────────────────────────────────┤
│  [ League | Conference | Division ]  │
├──────────────────────────────────────┤
│                                      │
│  League View (30 teams)              │
│  ┌────────────────────────────────┐  │
│  │ 1. ☰ [LAL Logo] Lakers         │  │
│  ├────────────────────────────────┤  │
│  │ 2. ☰ [GSW Logo] Warriors       │  │
│  ├────────────────────────────────┤  │
│  │ 3. ☰ [BOS Logo] Celtics        │  │
│  ├────────────────────────────────┤  │
│  │ ...                            │  │
│  └────────────────────────────────┘  │
│                                      │
│  Team Weight: ○ Light  ● Med  ○ High │
│                                      │
│  ┌────────────────────────────────┐  │
│  │          Save & Continue        │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

#### View Toggle Behavior

**League View**: Single list, all 30 teams
**Conference View**: Two lists (East | West)
**Division View**: Six mini-lists (Atlantic, Central, Southeast, etc.)

All views write to the same canonical `teamRank[teamId] = 1..30`

#### Components

**ViewToggle**
```typescript
interface ViewToggleProps {
  activeView: 'league' | 'conference' | 'division';
  onChange: (view: ViewToggleProps['activeView']) => void;
}

// Segmented control (iOS-style)
// Switches between ranking views
// Persists selection to local storage
```

**DraggableTeamList**
```typescript
interface DraggableTeamListProps {
  teams: Team[];
  onReorder: (newOrder: Team[]) => void;
  view: 'league' | 'conference' | 'division';
}

interface Team {
  id: string;
  name: string;
  abbreviation: string;
  logoUrl: string;
  conference: 'East' | 'West';
  division: string;
  rank: number;
}

// Drag-and-drop list
// Shows rank numbers
// Visual feedback during drag
// Smooth reordering animation
```

**TeamCard (Draggable)**
```typescript
interface TeamCardProps {
  team: Team;
  rank: number;
  isDragging?: boolean;
  dragHandleProps?: any;
}

// Individual team item
// Logo + Name
// Drag handle (☰)
// Hover/active states
// Minimum 56px height (touch target)
```

**WeightSelector**
```typescript
interface WeightSelectorProps {
  value: 'light' | 'medium' | 'strong';
  onChange: (weight: WeightSelectorProps['value']) => void;
}

// Radio group styled as buttons
// Light = tiebreaker only
// Medium = moderate influence
// Strong = heavy influence
```

#### Drag-and-Drop Specifications

**Visual Feedback**
```css
/* Dragging State */
.team-card--dragging {
  opacity: 0.5;
  transform: scale(1.05);
  box-shadow: var(--shadow-xl);
  cursor: grabbing;
}

/* Drop Zone */
.team-list__drop-zone {
  background: var(--color-court-light);
  opacity: 0.2;
  height: 4px;
  border-radius: var(--radius-full);
  transition: var(--transition-fast);
}

.team-list__drop-zone--active {
  height: 64px;
  opacity: 0.4;
}

/* Drag Handle */
.team-card__drag-handle {
  cursor: grab;
  padding: var(--space-4);
  color: var(--color-gray-600);
  transition: var(--transition-fast);
}

.team-card__drag-handle:hover {
  color: var(--color-court-primary);
}

.team-card__drag-handle:active {
  cursor: grabbing;
}
```

**Animation**
```css
/* Reorder Animation */
.team-card {
  transition: transform var(--duration-normal) var(--ease-in-out);
}

/* Insert Animation */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

#### Conference View Layout

```
┌──────────────────────────────────────┐
│  [ League | Conference | Division ]  │
├──────────────────────────────────────┤
│                                      │
│  ┌──────────┐      ┌──────────┐     │
│  │  EAST    │      │  WEST    │     │
│  ├──────────┤      ├──────────┤     │
│  │ 1. BOS   │      │ 1. LAL   │     │
│  │ 2. MIA   │      │ 2. GSW   │     │
│  │ 3. PHI   │      │ 3. DEN   │     │
│  │ ...      │      │ ...      │     │
│  └──────────┘      └──────────┘     │
│                                      │
└──────────────────────────────────────┘
```

#### Division View Layout

```
┌──────────────────────────────────────┐
│  [ League | Conference | Division ]  │
├──────────────────────────────────────┤
│                                      │
│  ATLANTIC    CENTRAL    SOUTHEAST    │
│  1. BOS      1. MIL     1. MIA       │
│  2. PHI      2. CLE     2. ATL       │
│  ...         ...        ...          │
│                                      │
│  NORTHWEST   PACIFIC    SOUTHWEST    │
│  1. DEN      1. LAL     1. DAL       │
│  2. MIN      2. GSW     2. MEM       │
│  ...         ...        ...          │
└──────────────────────────────────────┘
```

---

### 5.4 Player Preferences Page (`/app/preferences/players/page.tsx`)

#### Visual Layout

```
┌──────────────────────────────────────┐
│  ← Back         Player Preferences   │
├──────────────────────────────────────┤
│                                      │
│  Add Players:                        │
│  ┌────────────────────────────────┐  │
│  │ 🔍 Search players...           │  │
│  └────────────────────────────────┘  │
│                                      │
│  [Team Rosters ▼] [Leaders Tray ▼]  │
│                                      │
├──────────────────────────────────────┤
│  MUST-SEE TV 🌟                      │
│  ┌──┬──┬──┬──┬──┐                   │
│  │ │ │ │ │ │ │ │ │ │                   │
│  └──┴──┴──┴──┴──┘                   │
│  Drop players here...                │
│                                      │
│  HOOPER 🔥                           │
│  ┌──┬──┬──┬──┬──┐                   │
│  │ │ │ │ │ │ │ │ │ │                   │
│  └──┴──┴──┴──┴──┘                   │
│  Drop players here...                │
│                                      │
│  VILLAIN 😈                          │
│  ┌──┬──┬──┬──┬──┐                   │
│  │ │ │ │ │ │ │ │ │ │                   │
│  └──┴──┴──┴──┴──┘                   │
│  Drop players here...                │
│                                      │
│  🐐 GOAT BADGE (optional)            │
│  [Select one player...]              │
│                                      │
│  ┌────────────────────────────────┐  │
│  │          Save & Continue        │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

#### Components

**PlayerBuckets**
```typescript
interface PlayerBucketsProps {
  mustSee: Player[];
  hooper: Player[];
  villain: Player[];
  goat: Player | null;
  onAddPlayer: (bucket: BucketType, player: Player) => void;
  onRemovePlayer: (bucket: BucketType, playerId: string) => void;
  onSetGoat: (player: Player | null) => void;
}

type BucketType = 'must-see' | 'hooper' | 'villain';

interface Player {
  id: string;
  name: string;
  teamId: string;
  headshot: string;
  position: string;
  jerseyNumber: string;
}

// Three drop zones (buckets)
// Visual distinction per bucket
// Drag-and-drop support
// Remove players with swipe or tap-X
```

**PlayerSearch**
```typescript
interface PlayerSearchProps {
  onSelectPlayer: (player: Player) => void;
  placeholder?: string;
}

// Autocomplete search
// Debounced input (300ms)
// Shows recent searches
// Player card results with headshots
```

**TeamRosterDropdown**
```typescript
interface TeamRosterDropdownProps {
  teams: Team[];
  onSelectPlayer: (player: Player) => void;
}

// Dropdown with all 30 teams
// Expands to show roster grid
// Headshot tiles (draggable)
// Quick way to add players by team
```

**LeadersTray**
```typescript
interface LeadersTrayProps {
  category: LeaderCategory;
  leaders: Player[];
  onCategoryChange: (category: LeaderCategory) => void;
  onDragPlayer: (player: Player) => void;
  showNerdStats?: boolean;
}

type LeaderCategory =
  | 'points' | 'rebounds' | 'assists' | 'steals' | 'blocks'
  | '3pm' | 'fg-pct' | '3p-pct' | 'ft-pct'
  | 'turnovers' | 'minutes' | 'double-doubles' | 'triple-doubles';

// Horizontal scrolling tray
// Category selector (tabs)
// Top 10 leaders per category
// Draggable player cards
// "Nerd toggle" for advanced stats (V1)
```

**PlayerCard (Draggable)**
```typescript
interface PlayerCardProps {
  player: Player;
  isDragging?: boolean;
  dragHandleProps?: any;
  showStats?: boolean;
  bucket?: BucketType;
  onRemove?: () => void;
}

// Player headshot (circular)
// Name + Team
// Optional stats
// Remove button (X)
// Bucket-specific styling
```

#### Bucket Visual Design

```css
/* Must-See TV Bucket */
.bucket--must-see {
  background: linear-gradient(
    135deg,
    rgba(255, 215, 0, 0.1) 0%,
    rgba(255, 215, 0, 0.05) 100%
  );
  border: 2px dashed var(--color-must-see);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  min-height: 120px;
}

.bucket--must-see .bucket__label {
  color: var(--color-must-see);
  font-weight: var(--font-bold);
}

/* Hooper Bucket */
.bucket--hooper {
  background: linear-gradient(
    135deg,
    rgba(76, 175, 80, 0.1) 0%,
    rgba(76, 175, 80, 0.05) 100%
  );
  border: 2px dashed var(--color-hooper);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  min-height: 120px;
}

/* Villain Bucket */
.bucket--villain {
  background: linear-gradient(
    135deg,
    rgba(156, 39, 176, 0.1) 0%,
    rgba(156, 39, 176, 0.05) 100%
  );
  border: 2px dashed var(--color-villain);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  min-height: 120px;
}

/* Drop Zone Active State */
.bucket--active {
  border-style: solid;
  border-width: 3px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: var(--shadow-lg);
  transform: scale(1.02);
  transition: var(--transition-bounce);
}

/* Player Card in Bucket */
.player-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
  position: relative;
  min-width: 80px;
}

.player-card__headshot {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-full);
  border: 2px solid var(--color-gray-300);
  object-fit: cover;
}

.player-card__name {
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  text-align: center;
  max-width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.player-card__remove {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--color-error);
  color: var(--color-white);
  border: 2px solid var(--color-white);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  transition: var(--transition-fast);
}

.player-card__remove:hover {
  transform: scale(1.1);
}
```

#### GOAT Badge Selector

```css
.goat-selector {
  margin-top: var(--space-8);
  padding: var(--space-6);
  background: linear-gradient(
    135deg,
    rgba(255, 107, 107, 0.1) 0%,
    rgba(255, 107, 107, 0.05) 100%
  );
  border: 2px solid var(--color-goat);
  border-radius: var(--radius-lg);
}

.goat-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-5);
  background: var(--color-goat);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
}

.goat-badge::before {
  content: '🐐';
  font-size: var(--text-2xl);
}
```

---

### 5.5 Style Preferences Page (`/app/preferences/style/page.tsx`)

#### Visual Layout

```
┌──────────────────────────────────────┐
│  ← Back         Style Preferences    │
├──────────────────────────────────────┤
│                                      │
│  Tune your watchability style:       │
│                                      │
│  Offense ━━━━●━━━━━ Defense          │
│  (Love shootouts) | (Love lockdown)  │
│                                      │
│  Fast Pace ━━━━━━●━━ Slow Pace      │
│  (Up tempo) | (Grind it out)         │
│                                      │
│  Ball Movement ━━●━━━━━ Isolation    │
│  (Team game) | (ISO ball)            │
│                                      │
│  Star Duels ━━━━━━━●━ Team System   │
│  (Superstar matchups) | (System)     │
│                                      │
│  Chaos ━━━━━●━━━━ Control            │
│  (Wild swings) | (Steady)            │
│                                      │
│  Rivalry ━━━━━━━━●━ Regular          │
│  (History matters) | (Just ball)     │
│                                      │
├──────────────────────────────────────┤
│  Preview:                            │
│  "You love high-octane offense       │
│   with ball movement and star        │
│   power. Chaos is your friend."      │
│                                      │
│  ┌────────────────────────────────┐  │
│  │          Save & Continue        │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

#### Components

**StyleSlider**
```typescript
interface StyleSliderProps {
  id: string;
  label: string;
  leftLabel: string;
  rightLabel: string;
  leftDescription?: string;
  rightDescription?: string;
  value: number;  // 0-100
  onChange: (value: number) => void;
  defaultValue?: number;
}

// Range slider (0-100)
// Labels on both ends
// Helper text below
// Live preview updates as user slides
// Visual indicator at midpoint (50)
```

**LivePreview**
```typescript
interface LivePreviewProps {
  sliders: StyleSliderValues;
}

interface StyleSliderValues {
  offenseDefense: number;
  pace: number;
  ballMovementIso: number;
  starTeam: number;
  chaosControl: number;
  rivalry: number;
}

// Generates preview text from slider values
// Updates in real-time
// Natural language description
// 2-3 sentences max
```

#### Slider Design

```css
/* Slider Container */
.style-slider {
  margin-bottom: var(--space-10);
}

.style-slider__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-3);
}

.style-slider__label {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-black);
}

.style-slider__labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--space-2);
  gap: var(--space-4);
}

.style-slider__label-left,
.style-slider__label-right {
  font-size: var(--text-sm);
  color: var(--color-gray-800);
  font-weight: var(--font-medium);
  flex: 1;
}

.style-slider__label-right {
  text-align: right;
}

/* Range Input */
.style-slider__input {
  width: 100%;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-gray-300);
  outline: none;
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;
  position: relative;
}

/* Track Fill (shows selected value) */
.style-slider__input::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--gradient-primary);
  border-radius: var(--radius-full);
  width: var(--slider-value-percent);
  pointer-events: none;
}

/* Thumb */
.style-slider__input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-court-primary);
  border: 3px solid var(--color-white);
  box-shadow: var(--shadow-md);
  cursor: grab;
  transition: var(--transition-fast);
}

.style-slider__input::-webkit-slider-thumb:active {
  cursor: grabbing;
  transform: scale(1.15);
  box-shadow: var(--shadow-lg);
}

.style-slider__input::-moz-range-thumb {
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  background: var(--color-court-primary);
  border: 3px solid var(--color-white);
  box-shadow: var(--shadow-md);
  cursor: grab;
  transition: var(--transition-fast);
}

/* Midpoint Marker */
.style-slider::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 12px;
  background: var(--color-gray-500);
  pointer-events: none;
}

/* Descriptions */
.style-slider__descriptions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--space-2);
  gap: var(--space-4);
}

.style-slider__description {
  font-size: var(--text-xs);
  color: var(--color-gray-600);
  font-style: italic;
}
```

#### Preview Design

```css
.live-preview {
  background: var(--gradient-court);
  padding: var(--space-8);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  margin-top: var(--space-8);
}

.live-preview__label {
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  color: var(--color-white);
  opacity: 0.8;
  margin-bottom: var(--space-3);
  font-weight: var(--font-semibold);
}

.live-preview__text {
  font-size: var(--text-lg);
  line-height: var(--leading-relaxed);
  color: var(--color-white);
  font-weight: var(--font-medium);
}
```

---

### 5.6 Results Page (`/app/results/page.tsx`)

#### Visual Layout

```
┌──────────────────────────────────────┐
│  ← Back              Results         │
├──────────────────────────────────────┤
│                                      │
│  "Playoff intensity starts to build."│
│  Slate: Dec 19, 07:30 - Dec 20, 07:30│
│  (5 games)                           │
│                                      │
│  [Share This List 📤]                │
│                                      │
├──────────────────────────────────────┤
│  YOUR RANKED GAMES                   │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 1. Thunder at Timberwolves     │  │
│  │                                │  │
│  │ late drama • big momentum swing│  │
│  │ playoff-style intensity        │  │
│  │                                │  │
│  │ Watch: 4th quarter full        │  │
│  │ [Watch Now →]                  │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ 2. 76ers at Knicks             │  │
│  │ ...                            │  │
│  └────────────────────────────────┘  │
│                                      │
│  ...                                 │
│                                      │
├──────────────────────────────────────┤
│  DISCOVERY                           │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Bulls at Cavaliers             │  │
│  │ rookie spotlight • new rotation│  │
│  │ [Watch →]                      │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

#### Components

**ResultsHeader**
```typescript
interface ResultsHeaderProps {
  headline: string;
  slateWindow: {
    start: string;
    end: string;
    timezone: string;
  };
  gameCount: number;
  onShare: () => void;
}

// Spoiler-free headline
// Slate metadata
// Share button (prominent)
```

**RankedGameList**
```typescript
interface RankedGameListProps {
  games: RankedGame[];
  onWatchClick: (gameId: string) => void;
}

interface RankedGame {
  rank: number;
  gameId: string;
  matchup: string;
  awayTeam: string;
  homeTeam: string;
  tags: string[];
  watchSuggestion: string;
  watchLinks: {
    nbaApp: string;
    webFallback: string;
  };
}

// Ordered list of game cards
// Numbered 1-N
// Visual rank indicator
```

**GameCard**
```typescript
interface GameCardProps {
  game: RankedGame;
  rank: number;
  onWatchClick: () => void;
  variant?: 'ranked' | 'discovery';
}

// Card with matchup
// Tag list
// Viewing suggestion
// Watch button
// Quality indicator (color-coded by rank)
```

**TagList**
```typescript
interface TagListProps {
  tags: string[];
  maxVisible?: number;
}

// Horizontal tag list
// Pills/chips design
// Truncate after N tags with "+N more"
```

**ViewingSuggestion**
```typescript
interface ViewingSuggestionProps {
  suggestion: string;
  variant?: 'full' | 'compact';
}

type SuggestionType =
  | 'watch_4q_full'
  | 'condensed_then_4q_full'
  | 'condensed_then_full_late'
  | 'condensed_enough'
  | 'condensed_or_skip';

// Displays watch recommendation
// Icons for different types
// Clear, actionable language
```

**WatchButton**
```typescript
interface WatchButtonProps {
  gameId: string;
  links: {
    nbaApp: string;
    webFallback: string;
  };
  onClick: () => void;
}

// Primary CTA button
// Opens NBA app or web fallback
// Tracks analytics
```

**DiscoverySection**
```typescript
interface DiscoverySectionProps {
  games: DiscoveryGame[];
  onWatchClick: (gameId: string) => void;
}

interface DiscoveryGame {
  gameId: string;
  matchup: string;
  tags: string[];  // No player names
  watchSuggestion: string;
  watchLinks: {
    nbaApp: string;
    webFallback: string;
  };
}

// Separate section below ranked games
// Generic tags only
// Optional (1-2 games max)
```

**ShareButton**
```typescript
interface ShareButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

// Creates shareable snapshot
// Prominent placement
// NBA Jam-inspired styling
```

#### Game Card Design

```css
.game-card {
  background: var(--color-white);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--space-4);
  border-left: 4px solid var(--color-quality);
  transition: var(--transition-default);
}

.game-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

/* Quality Color Coding */
.game-card--rank-1,
.game-card--rank-2,
.game-card--rank-3 {
  border-left-color: var(--color-quality-high);
}

.game-card--rank-4,
.game-card--rank-5 {
  border-left-color: var(--color-quality-medium);
}

.game-card--rank-low {
  border-left-color: var(--color-quality-low);
}

/* Rank Badge */
.game-card__rank {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--color-quality);
  color: var(--color-white);
  font-weight: var(--font-bold);
  font-size: var(--text-lg);
  margin-bottom: var(--space-3);
}

/* Matchup */
.game-card__matchup {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-black);
  margin-bottom: var(--space-4);
  line-height: var(--leading-tight);
}

/* Tags */
.game-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.tag {
  display: inline-flex;
  align-items: center;
  padding: var(--space-2) var(--space-3);
  background: var(--color-gray-200);
  color: var(--color-gray-900);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  white-space: nowrap;
}

/* Viewing Suggestion */
.game-card__suggestion {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--color-gray-100);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-4);
}

.game-card__suggestion-icon {
  font-size: var(--text-xl);
}

.game-card__suggestion-text {
  font-size: var(--text-sm);
  color: var(--color-gray-900);
  font-weight: var(--font-medium);
}

/* Watch Button */
.game-card__watch-button {
  width: 100%;
  background: var(--gradient-primary);
  color: var(--color-white);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: var(--transition-default);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  min-height: var(--touch-comfortable);
}

.game-card__watch-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.game-card__watch-button:active {
  transform: translateY(0);
}
```

#### Discovery Section Design

```css
.discovery-section {
  margin-top: var(--space-12);
  padding-top: var(--space-8);
  border-top: 2px solid var(--color-gray-300);
}

.discovery-section__header {
  margin-bottom: var(--space-6);
}

.discovery-section__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-black);
  margin-bottom: var(--space-2);
}

.discovery-section__description {
  font-size: var(--text-base);
  color: var(--color-gray-800);
  line-height: var(--leading-relaxed);
}

.discovery-card {
  background: linear-gradient(
    135deg,
    rgba(25, 118, 210, 0.05) 0%,
    rgba(25, 118, 210, 0.02) 100%
  );
  border: 1px solid var(--color-info);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  margin-bottom: var(--space-4);
}

.discovery-card__label {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-3);
  background: var(--color-info);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
  margin-bottom: var(--space-3);
}
```

---

### 5.7 Share Page (`/app/share/[id]/page.tsx`)

#### Visual Layout

```
┌──────────────────────────────────────┐
│  [Logo]                              │
├──────────────────────────────────────┤
│                                      │
│  "Playoff intensity starts to build."│
│                                      │
│  Spoiler-free games to watch         │
│                                      │
│  Slate window:                       │
│  Dec 19, 07:30 - Dec 20, 07:30       │
│  (Europe/Lisbon)                     │
│                                      │
│  ┌──────────────────┐                │
│  │  [Avatar 🐐]     │                │
│  │  Chad Cribbins   │                │
│  └──────────────────┘                │
│                                      │
├──────────────────────────────────────┤
│  RANKED GAMES                        │
│                                      │
│  1. Thunder at Timberwolves          │
│     late drama • big momentum swing  │
│                                      │
│  2. 76ers at Knicks                  │
│     high-energy • physical           │
│                                      │
│  ...                                 │
│                                      │
├──────────────────────────────────────┤
│                                      │
│  Disagree?                           │
│  ┌────────────────────────────────┐  │
│  │   Build Your Own Profile        │  │
│  └────────────────────────────────┘  │
│                                      │
└──────────────────────────────────────┘
```

#### Components

**ShareHeader**
```typescript
interface ShareHeaderProps {
  headline: string;
  slateWindow: {
    start: string;
    end: string;
    timezone: string;
    label: string;
  };
}

// Headline (spoiler-free)
// Subtitle: "Spoiler-free games to watch"
// Slate metadata
```

**ShareAttribution**
```typescript
interface ShareAttributionProps {
  userName: string;
  avatarUrl?: string;
  goatBadge?: boolean;
}

// Cartoon avatar
// GOAT jersey if selected
// User name
// "Curated by..." label
```

**RankedGameList (Read-Only)**
```typescript
interface ShareRankedGameListProps {
  games: ShareGame[];
}

interface ShareGame {
  rank: number;
  matchup: string;
  tags: string[];
}

// Simplified game cards
// No watch buttons
// Read-only presentation
// Focus on rankings and tags
```

**CTAButton**
```typescript
interface ShareCTAButtonProps {
  text: string;
  href: string;
}

// "Build Your Own Profile"
// Links to /onboarding
// Prominent placement
// Primary button styling
```

#### Share Page Design

```css
.share-page {
  min-height: 100vh;
  background: linear-gradient(
    180deg,
    var(--color-hardwood-light) 0%,
    var(--color-white) 30%
  );
  padding: var(--space-8) var(--space-6);
}

.share-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.share-header__headline {
  font-size: var(--text-3xl);
  font-weight: var(--font-black);
  color: var(--color-black);
  margin-bottom: var(--space-3);
  line-height: var(--leading-tight);
}

.share-header__subtitle {
  font-size: var(--text-lg);
  color: var(--color-gray-800);
  margin-bottom: var(--space-4);
}

.share-header__slate-info {
  font-size: var(--text-sm);
  color: var(--color-gray-700);
  line-height: var(--leading-relaxed);
}

/* Attribution */
.share-attribution {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6);
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--space-8);
}

.share-attribution__avatar {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-full);
  border: 3px solid var(--color-court-primary);
  position: relative;
}

.share-attribution__goat-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  background: var(--color-goat);
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-lg);
  border: 2px solid var(--color-white);
  box-shadow: var(--shadow-md);
}

.share-attribution__label {
  font-size: var(--text-sm);
  color: var(--color-gray-700);
  text-transform: uppercase;
  letter-spacing: var(--tracking-wide);
}

.share-attribution__name {
  font-size: var(--text-xl);
  font-weight: var(--font-bold);
  color: var(--color-black);
}

/* CTA Section */
.share-cta {
  text-align: center;
  margin-top: var(--space-12);
  padding: var(--space-8);
  background: var(--gradient-court);
  border-radius: var(--radius-xl);
}

.share-cta__question {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-white);
  margin-bottom: var(--space-6);
}

.share-cta__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-5) var(--space-8);
  background: var(--gradient-primary);
  color: var(--color-white);
  border-radius: var(--radius-full);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  text-decoration: none;
  box-shadow: var(--shadow-lg);
  transition: var(--transition-default);
  min-height: var(--touch-comfortable);
}

.share-cta__button:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}
```

---

## 6. Interaction Patterns

### 6.1 Drag-and-Drop System

#### Core Principles

1. **Clear Visual Feedback**
   - Item being dragged: scale up, add shadow, reduce opacity of source
   - Drop zones: highlight when dragging over
   - Invalid drop zones: show "not allowed" cursor

2. **Mobile-First**
   - Support both touch and mouse
   - Long-press to initiate drag on mobile
   - Visual hint for drag capability (drag handle icon)

3. **Smooth Animations**
   - Items reorder smoothly
   - Drop zones expand/contract fluidly
   - NBA Jam-inspired bounce on successful drop

#### Implementation Approach

```typescript
// Use @dnd-kit for drag-and-drop
// Modern, accessible, touch-friendly

import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';

// Sensors configuration
const sensors = useSensors(
  useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8, // 8px movement to activate (prevents accidental drags)
    },
  }),
  useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250, // 250ms long-press on mobile
      tolerance: 5,
    },
  })
);
```

#### Drag States

```css
/* Item being dragged */
.draggable--dragging {
  opacity: 0.4;
  transform: scale(1.05);
  cursor: grabbing;
}

/* Drag overlay (follows cursor) */
.drag-overlay {
  opacity: 1;
  transform: scale(1.1) rotate(3deg);
  box-shadow: var(--shadow-xl);
  cursor: grabbing;
  z-index: var(--z-modal);
}

/* Drop zone (default) */
.drop-zone {
  border: 2px dashed transparent;
  border-radius: var(--radius-lg);
  transition: var(--transition-default);
  min-height: 100px;
}

/* Drop zone (active - item being dragged over) */
.drop-zone--active {
  border-color: var(--color-court-primary);
  background: rgba(230, 73, 33, 0.1);
  transform: scale(1.02);
}

/* Drop zone (valid) */
.drop-zone--valid {
  border-color: var(--color-success);
  background: rgba(45, 138, 62, 0.1);
}

/* Drop zone (invalid) */
.drop-zone--invalid {
  border-color: var(--color-error);
  background: rgba(211, 47, 47, 0.1);
  cursor: not-allowed;
}
```

#### Success Animation

```css
@keyframes dropSuccess {
  0% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  50% {
    transform: scale(0.95);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.item--dropped {
  animation: dropSuccess var(--duration-normal) var(--ease-bounce);
}
```

### 6.2 Slider Interactions

#### Touch Optimization

```css
.slider {
  /* Increase hit area for mobile */
  padding: var(--space-4) 0;
  -webkit-tap-highlight-color: transparent;
}

.slider__thumb {
  /* Large enough for touch */
  width: 28px;
  height: 28px;

  /* Increase visual feedback on touch */
  touch-action: pan-x;
}

@media (hover: none) and (pointer: coarse) {
  /* Mobile-specific adjustments */
  .slider__thumb {
    width: 32px;
    height: 32px;
  }
}
```

#### Live Feedback

```typescript
interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  debounce?: number;
}

// onChange fires on every movement (for live preview)
// onChangeEnd fires when user releases (for saving)
// Optional debounce for performance
```

### 6.3 Loading States

#### NBA Jam-Inspired Loader

```css
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-12);
}

.loading-spinner__basketball {
  width: 64px;
  height: 64px;
  background: var(--color-court-primary);
  border-radius: var(--radius-full);
  position: relative;
  animation: bounce 0.6s ease-in-out infinite alternate;
}

@keyframes bounce {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-20px);
  }
}

.loading-spinner__text {
  margin-top: var(--space-6);
  font-size: var(--text-lg);
  font-weight: var(--font-bold);
  color: var(--color-court-primary);
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
```

#### Loading Messages (Rotated)

```typescript
const loadingMessages = [
  "Crunching the numbers...",
  "Analyzing the slate...",
  "Finding the watchable gems...",
  "Checking for drama...",
  "Ranking the action...",
  "He's heating up...",
  "Boomshakalaka!",
];

// Rotate message every 2 seconds during load
```

### 6.4 Empty States

#### No Games in Slate

```typescript
interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

```css
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-12);
  min-height: 400px;
}

.empty-state__icon {
  font-size: 64px;
  margin-bottom: var(--space-6);
  opacity: 0.5;
}

.empty-state__title {
  font-size: var(--text-2xl);
  font-weight: var(--font-bold);
  color: var(--color-black);
  margin-bottom: var(--space-3);
}

.empty-state__description {
  font-size: var(--text-base);
  color: var(--color-gray-700);
  line-height: var(--leading-relaxed);
  max-width: 400px;
  margin-bottom: var(--space-6);
}
```

#### Empty Bucket (Player Preferences)

```typescript
// Example
<EmptyState
  icon="🏀"
  title="No players in this bucket yet"
  description="Drag players here from the search, team rosters, or leaders tray."
/>
```

### 6.5 Button States

#### Primary Button

```css
.button-primary {
  background: var(--gradient-primary);
  color: var(--color-white);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-md);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  min-height: var(--touch-comfortable);
  transition: var(--transition-default);
  position: relative;
  overflow: hidden;
}

.button-primary::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.2) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 0;
  transition: var(--transition-fast);
}

.button-primary:hover::before {
  opacity: 1;
}

.button-primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.button-primary:active {
  transform: translateY(0);
}

.button-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

#### Secondary Button

```css
.button-secondary {
  background: transparent;
  color: var(--color-court-primary);
  padding: var(--space-4) var(--space-6);
  border-radius: var(--radius-md);
  border: 2px solid var(--color-court-primary);
  font-weight: var(--font-semibold);
  font-size: var(--text-base);
  cursor: pointer;
  min-height: var(--touch-comfortable);
  transition: var(--transition-default);
}

.button-secondary:hover {
  background: var(--color-court-primary);
  color: var(--color-white);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.button-secondary:active {
  transform: translateY(0);
}
```

### 6.6 Micro-interactions

#### Success Feedback

```css
@keyframes successPulse {
  0% {
    box-shadow: 0 0 0 0 rgba(45, 138, 62, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(45, 138, 62, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(45, 138, 62, 0);
  }
}

.success-feedback {
  animation: successPulse 0.6s ease-out;
}
```

#### Tag Hover

```css
.tag {
  transition: var(--transition-fast);
}

.tag:hover {
  transform: scale(1.05);
  box-shadow: var(--shadow-sm);
}
```

#### Card Interaction

```css
.card {
  transition: var(--transition-default);
  cursor: pointer;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card:active {
  transform: translateY(-2px);
}
```

---

## 7. Accessibility

### 7.1 Keyboard Navigation

#### Focus Management

```css
/* Focus visible (not on mouse click) */
*:focus-visible {
  outline: 3px solid var(--color-court-primary);
  outline-offset: 2px;
}

/* Remove outline on mouse click */
*:focus:not(:focus-visible) {
  outline: none;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  *:focus-visible {
    outline-width: 4px;
  }
}
```

#### Skip Links

```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-court-primary);
  color: var(--color-white);
  padding: var(--space-3) var(--space-5);
  text-decoration: none;
  border-radius: var(--radius-md);
  z-index: var(--z-tooltip);
}

.skip-link:focus {
  top: var(--space-4);
  left: var(--space-4);
}
```

#### Drag-and-Drop Keyboard Support

```typescript
// Announce drag-and-drop instructions
const dragInstructions = {
  'aria-label': 'Draggable team. Press space to pick up, arrow keys to move, space to drop',
};

// Keyboard handlers
const handleKeyDown = (e: KeyboardEvent) => {
  switch (e.key) {
    case ' ':
    case 'Enter':
      // Pick up / drop item
      toggleDrag();
      break;
    case 'ArrowUp':
      // Move item up
      moveItem('up');
      break;
    case 'ArrowDown':
      // Move item down
      moveItem('down');
      break;
    case 'Escape':
      // Cancel drag
      cancelDrag();
      break;
  }
};
```

### 7.2 Screen Reader Support

#### ARIA Labels

```typescript
// Game Card
<article
  role="article"
  aria-labelledby={`game-${gameId}-matchup`}
  aria-describedby={`game-${gameId}-tags game-${gameId}-suggestion`}
>
  <h3 id={`game-${gameId}-matchup`}>
    {rank}. {matchup}
  </h3>
  <div id={`game-${gameId}-tags`} aria-label="Game characteristics">
    {tags.map(tag => <span>{tag}</span>)}
  </div>
  <div id={`game-${gameId}-suggestion`}>
    {watchSuggestion}
  </div>
</article>

// Slider
<input
  type="range"
  role="slider"
  aria-label="Offense to Defense preference"
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={value}
  aria-valuetext={`${value} percent toward ${value > 50 ? 'defense' : 'offense'}`}
/>

// Loading state
<div
  role="status"
  aria-live="polite"
  aria-busy="true"
>
  Analyzing the slate...
</div>
```

#### Live Regions

```typescript
// Announce drag success
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
  className="sr-only"
>
  {dragMessage}
</div>

// Example messages:
// "Lakers moved to position 1"
// "LeBron James added to Must-See TV"
// "Slider updated to 75 percent toward defense"
```

#### Screen Reader Only Content

```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 7.3 Color Contrast

#### WCAG AA Compliance

All text must meet WCAG AA standards:
- Normal text (< 18pt): 4.5:1 contrast ratio
- Large text (≥ 18pt): 3:1 contrast ratio
- UI components: 3:1 contrast ratio

#### Contrast Checks

```typescript
// Primary text on white
--color-black: #1A1A1A on --color-white: #FFFFFF
Contrast: 16.1:1 ✓ (AAA)

// Gray text on white (minimum allowed)
--color-gray-700: #6B6B6B on --color-white: #FFFFFF
Contrast: 4.6:1 ✓ (AA)

// White text on primary
--color-white: #FFFFFF on --color-court-primary: #E64921
Contrast: 4.1:1 ✓ (AA for large text)

// Tag text
--color-gray-900: #2D2D2D on --color-gray-200: #E8E8E8
Contrast: 10.4:1 ✓ (AAA)
```

#### Don't Rely on Color Alone

```typescript
// Bad: Color-only indicator
<div style={{ borderLeft: '4px solid green' }}>
  Top game
</div>

// Good: Color + icon + text
<div className="game-card--high-quality">
  <span className="rank-badge" aria-label="Rank 1">1</span>
  <span className="sr-only">High quality game</span>
  Thunder at Timberwolves
</div>
```

### 7.4 Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  /* Still show state changes, just without animation */
  .game-card:hover {
    box-shadow: var(--shadow-lg);
    /* Remove transform */
  }
}
```

### 7.5 Touch Target Sizing

```css
/* Minimum touch target: 44x44pt (Apple HIG / WCAG) */
.button,
.link,
.drag-handle,
.slider-thumb {
  min-width: 44px;
  min-height: 44px;
}

/* Comfortable touch target: 56px */
.button-primary,
.watch-button {
  min-height: 56px;
}

/* Add padding to increase hit area without changing visual size */
.small-button {
  padding: var(--space-3);
  /* Visual size: 32px, but hit area extends via padding */
}
```

---

## 8. Performance Guidelines

### 8.1 Loading Strategy

#### Critical Path

1. **Above-the-fold content first**
   - HTML structure
   - Critical CSS (inline)
   - Hero/CTA visible immediately

2. **Progressive enhancement**
   - Load JavaScript async
   - Hydrate interactivity after first paint

3. **Lazy load below-the-fold**
   - Game cards after viewport
   - Images on demand
   - Discovery section deferred

#### Code Splitting

```typescript
// Route-based code splitting
const TeamPreferences = lazy(() => import('./pages/TeamPreferences'));
const PlayerPreferences = lazy(() => import('./pages/PlayerPreferences'));
const Results = lazy(() => import('./pages/Results'));

// Component-based code splitting
const LeadersTray = lazy(() => import('./components/LeadersTray'));
const DiscoverySection = lazy(() => import('./components/DiscoverySection'));
```

### 8.2 Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={teamLogo}
  alt={`${teamName} logo`}
  width={48}
  height={48}
  loading="lazy"
  placeholder="blur"
/>

// Team logos: WebP format, 96x96 @ 2x = 192x192 source
// Player headshots: WebP, circular crop, 112x112 @ 2x = 224x224 source
```

### 8.3 Animation Performance

#### Use CSS Transforms (GPU-accelerated)

```css
/* Good: Transform (GPU) */
.card:hover {
  transform: translateY(-4px);
}

/* Bad: Top (CPU) */
.card:hover {
  top: -4px; /* Triggers layout recalculation */
}
```

#### Animate on Composite-Only Properties

Prefer animating:
- `transform`
- `opacity`

Avoid animating:
- `width`, `height` (triggers layout)
- `margin`, `padding` (triggers layout)
- `top`, `left` (triggers layout)

### 8.4 State Management

#### Local State First

```typescript
// Use React state for component-specific data
const [isExpanded, setIsExpanded] = useState(false);

// Use Context for shared data (avoid prop drilling)
const ProfileContext = createContext<Profile | null>(null);

// Use IndexedDB for persistent data (profile, preferences)
import { openDB } from 'idb';
```

#### Debounce Expensive Operations

```typescript
// Debounce search input
const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    searchPlayers(query);
  }, 300),
  []
);

// Debounce slider onChange
const debouncedSliderChange = useMemo(
  () => debounce((value: number) => {
    updatePreview(value);
  }, 100),
  []
);
```

### 8.5 Mobile Performance

#### Reduce Repaints

```css
/* Use will-change sparingly */
.draggable {
  will-change: transform;
}

/* Remove will-change after animation */
.draggable:not(.dragging) {
  will-change: auto;
}
```

#### Optimize Touch Events

```typescript
// Passive event listeners (better scroll performance)
element.addEventListener('touchstart', handler, { passive: true });
element.addEventListener('touchmove', handler, { passive: true });

// Only preventDefault when necessary
element.addEventListener('touchmove', (e) => {
  if (isDragging) {
    e.preventDefault(); // Prevent scroll during drag
  }
}, { passive: false });
```

#### Reduce JavaScript Bundle

- Tree-shake unused code
- Use dynamic imports for large components
- Minimize third-party dependencies
- Use modern JavaScript (smaller syntax)

---

## 9. Component API Contracts

### 9.1 Button

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
  children: React.ReactNode;
}

// Example usage
<Button
  variant="primary"
  size="lg"
  fullWidth
  icon={<PlayIcon />}
  iconPosition="right"
  onClick={handleRunSlate}
  loading={isLoading}
>
  Run Previous Slate
</Button>
```

### 9.2 Card

```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  borderColor?: string;
  onClick?: () => void;
  hoverable?: boolean;
  className?: string;
  children: React.ReactNode;
}

// Example usage
<Card
  variant="elevated"
  padding="lg"
  borderColor="var(--color-quality-high)"
  hoverable
  onClick={() => navigate(`/game/${gameId}`)}
>
  {children}
</Card>
```

### 9.3 Slider

```typescript
interface SliderProps {
  id: string;
  label: string;
  leftLabel: string;
  rightLabel: string;
  leftDescription?: string;
  rightDescription?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange: (value: number) => void;
  onChangeEnd?: (value: number) => void;
  showValue?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
}

// Example usage
<Slider
  id="offense-defense"
  label="Game Style"
  leftLabel="Offense"
  rightLabel="Defense"
  leftDescription="Love shootouts"
  rightDescription="Love lockdown"
  value={sliderValue}
  onChange={setSliderValue}
  onChangeEnd={savePreference}
  showValue
/>
```

### 9.4 DraggableList

```typescript
interface DraggableListProps<T> {
  items: T[];
  onReorder: (newOrder: T[]) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string;
  emptyState?: React.ReactNode;
  disabled?: boolean;
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

// Example usage
<DraggableList
  items={teams}
  onReorder={handleTeamReorder}
  renderItem={(team, index) => (
    <TeamCard team={team} rank={index + 1} />
  )}
  keyExtractor={(team) => team.id}
  emptyState={<EmptyState title="No teams" />}
  direction="vertical"
/>
```

### 9.5 Tag

```typescript
interface TagProps {
  label: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

// Example usage
<Tag
  label="late drama"
  variant="default"
  size="md"
/>

<Tag
  label="Must-See TV"
  variant="primary"
  removable
  onRemove={handleRemoveTag}
  icon={<StarIcon />}
/>
```

### 9.6 EmptyState

```typescript
interface EmptyStateProps {
  icon?: string | React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

// Example usage
<EmptyState
  icon="🏀"
  title="No games in this slate"
  description="The previous slate window has no completed games. Try adjusting your timezone or check back later."
  action={{
    label: "Adjust Settings",
    onClick: () => navigate('/settings')
  }}
/>
```

### 9.7 LoadingSpinner

```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  variant?: 'default' | 'nba-jam';
  fullScreen?: boolean;
}

// Example usage
<LoadingSpinner
  size="lg"
  message="Analyzing the slate..."
  variant="nba-jam"
  fullScreen
/>
```

---

## 10. State Management Design

### 10.1 State Architecture

```
┌─────────────────────────────────────┐
│  Browser Storage (IndexedDB)        │
│  - User profile                     │
│  - Preferences (teams/players/style)│
│  - Cached results                   │
└─────────────────────────────────────┘
             ↕
┌─────────────────────────────────────┐
│  React Context                      │
│  - Profile state                    │
│  - UI state (loading, errors)       │
└─────────────────────────────────────┘
             ↕
┌─────────────────────────────────────┐
│  Component Local State              │
│  - Form inputs                      │
│  - Temporary UI state               │
│  - Interaction state                │
└─────────────────────────────────────┘
```

### 10.2 Context Providers

```typescript
// Profile Context
interface ProfileContextValue {
  profile: Profile | null;
  loading: boolean;
  error: Error | null;
  updateTeamRanking: (teamRanking: TeamRanking) => Promise<void>;
  updatePlayerBuckets: (buckets: PlayerBuckets) => Promise<void>;
  updateStyleSliders: (sliders: StyleSliders) => Promise<void>;
  resetProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

// Results Context
interface ResultsContextValue {
  results: RankedResults | null;
  loading: boolean;
  error: Error | null;
  runSlate: () => Promise<void>;
  refreshResults: () => Promise<void>;
  createShare: () => Promise<string>; // Returns share ID
}

const ResultsContext = createContext<ResultsContextValue | null>(null);
```

### 10.3 Data Persistence

```typescript
// IndexedDB schema
const db = await openDB('nba-watchability', 1, {
  upgrade(db) {
    // Profile store
    db.createObjectStore('profile', { keyPath: 'id' });

    // Results cache
    const resultsStore = db.createObjectStore('results', { keyPath: 'id', autoIncrement: true });
    resultsStore.createIndex('slateWindow', 'slateWindow', { unique: false });
    resultsStore.createIndex('createdAt', 'createdAt', { unique: false });

    // Share snapshots
    db.createObjectStore('shares', { keyPath: 'shareId' });
  },
});

// Save profile
const saveProfile = async (profile: Profile) => {
  await db.put('profile', {
    ...profile,
    updatedAt: new Date().toISOString(),
  });
};

// Load profile
const loadProfile = async (): Promise<Profile | null> => {
  const profiles = await db.getAll('profile');
  return profiles[0] || null;
};

// Cache results
const cacheResults = async (results: RankedResults) => {
  await db.add('results', {
    ...results,
    createdAt: new Date().toISOString(),
  });

  // Keep only last 7 days
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const old = await db.getAllFromIndex('results', 'createdAt');
  for (const result of old) {
    if (new Date(result.createdAt) < weekAgo) {
      await db.delete('results', result.id);
    }
  }
};
```

### 10.4 Form State Management

```typescript
// Team Preferences Form
interface TeamPreferencesForm {
  teamRanking: TeamRanking;
  teamWeight: 'light' | 'medium' | 'strong';
  isDirty: boolean;
  isValid: boolean;
}

const useTeamPreferencesForm = () => {
  const { profile, updateTeamRanking } = useProfile();
  const [form, setForm] = useState<TeamPreferencesForm>({
    teamRanking: profile?.teamRanking || {},
    teamWeight: profile?.teamWeight || 'light',
    isDirty: false,
    isValid: true,
  });

  const handleReorder = (newRanking: TeamRanking) => {
    setForm(prev => ({
      ...prev,
      teamRanking: newRanking,
      isDirty: true,
    }));
  };

  const handleSave = async () => {
    await updateTeamRanking(form.teamRanking);
    setForm(prev => ({ ...prev, isDirty: false }));
  };

  return {
    form,
    handleReorder,
    handleSave,
  };
};
```

---

## 11. Critical User Flows (ASCII Wireframes)

### 11.1 Onboarding Flow

```
┌─────────────────────────────────────────────┐
│ Step 1: Welcome                             │
├─────────────────────────────────────────────┤
│                                             │
│              🏀 NBA JAM LOGO                │
│                                             │
│       Spoiler-Free NBA Watchability         │
│                                             │
│   Wake up to ranked games, zero spoilers.   │
│   Configure your preferences once, enjoy    │
│   personalized recommendations daily.       │
│                                             │
│   ✓ No scores revealed                      │
│   ✓ No winners spoiled                      │
│   ✓ Just pure watchability rankings         │
│                                             │
│         ┌───────────────────┐               │
│         │   Get Started     │               │
│         └───────────────────┘               │
│                                             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Step 2: Setup Choice                        │
├─────────────────────────────────────────────┤
│                                             │
│       Choose your setup style:              │
│                                             │
│  ┌───────────────┐    ┌──────────────────┐ │
│  │ QUICK SETUP   │    │  FULL SETUP      │ │
│  ├───────────────┤    ├──────────────────┤ │
│  │               │    │                  │ │
│  │ ~2 minutes    │    │  ~5 minutes      │ │
│  │               │    │                  │ │
│  │ • Team weight │    │  • Team ranking  │ │
│  │ • Style prefs │    │  • Player buckets│ │
│  │               │    │  • Style sliders │ │
│  │               │    │                  │ │
│  │ [Start Quick] │    │  [Start Full]    │ │
│  └───────────────┘    └──────────────────┘ │
│                                             │
│         You can always adjust later         │
│                                             │
└─────────────────────────────────────────────┘
                    ↓
         ┌──────────┴──────────┐
         ↓                     ↓
┌─────────────────┐   ┌────────────────────┐
│ Quick Path      │   │ Full Path          │
│                 │   │                    │
│ 1. Team Weight  │   │ 1. Team Ranking    │
│ 2. Style Sliders│   │ 2. Player Buckets  │
│ → Done          │   │ 3. Style Sliders   │
│                 │   │ → Done             │
└─────────────────┘   └────────────────────┘
```

### 11.2 Team Ranking Flow (League View)

```
┌─────────────────────────────────────────────┐
│ ← Back          Team Ranking                │
├─────────────────────────────────────────────┤
│                                             │
│  [ League | Conference | Division ]         │
│    ▔▔▔▔▔▔                                   │
│                                             │
│  Drag teams to rank your preferences:       │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ 1. ☰ [LAL] Lakers                     │  │
│  ├───────────────────────────────────────┤  │
│  │ 2. ☰ [GSW] Warriors                   │  │
│  ├───────────────────────────────────────┤  │
│  │ 3. ☰ [BOS] Celtics                    │  │
│  ├───────────────────────────────────────┤  │
│  │ 4. ☰ [MIA] Heat                       │  │
│  ├───────────────────────────────────────┤  │
│  │ 5. ☰ [PHX] Suns                       │  │
│  ├───────────────────────────────────────┤  │
│  │ ...                                   │  │
│  │ 30. ☰ [CHA] Hornets                   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  Team preference weight:                    │
│  ○ Light   ● Medium   ○ Strong              │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │          Save & Continue              │  │
│  └───────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘

User drags Warriors above Lakers:

┌─────────────────────────────────────────────┐
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ 1. ☰ [GSW] Warriors    ← moved up     │  │
│  ├───────────────────────────────────────┤  │
│  │ 2. ☰ [LAL] Lakers      ← moved down   │  │
│  ├───────────────────────────────────────┤  │
│  │ 3. ☰ [BOS] Celtics                    │  │
│  └───────────────────────────────────────┘  │
│                                             │
└─────────────────────────────────────────────┘
```

### 11.3 Player Bucketing Flow

```
┌─────────────────────────────────────────────┐
│ ← Back       Player Preferences             │
├─────────────────────────────────────────────┤
│                                             │
│  Add players:                               │
│  ┌───────────────────────────────────────┐  │
│  │ 🔍 Search: lebr...                    │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  [Team Rosters ▼]  [Leaders Tray ▼]        │
│                                             │
├─────────────────────────────────────────────┤
│ MUST-SEE TV 🌟                              │
│ Players you tune in for                     │
│                                             │
│  ┌─────┐ ┌─────┐ ┌─────┐                   │
│  │ KD  │ │Steph│ │     │  Drop here...     │
│  └─────┘ └─────┘ └─────┘                   │
│                                             │
├─────────────────────────────────────────────┤
│ HOOPER 🔥                                   │
│ Players you respect and enjoy               │
│                                             │
│  ┌─────┐ ┌─────┐ ┌─────┐                   │
│  │Jokic│ │Luka │ │     │  Drop here...     │
│  └─────┘ └─────┘ └─────┘                   │
│                                             │
├─────────────────────────────────────────────┤
│ VILLAIN 😈                                  │
│ Players who lower your joy                  │
│                                             │
│  ┌─────┐ ┌─────┐                           │
│  │Grayson│    │  Drop here...              │
│  │Allen│ │     │                            │
│  └─────┘ └─────┘                           │
│                                             │
├─────────────────────────────────────────────┤
│ 🐐 GOAT BADGE (Optional)                    │
│ Select one player:                          │
│                                             │
│  [Select from Must-See TV ▼]                │
│  Currently: LeBron James                    │
│                                             │
├─────────────────────────────────────────────┤
│  ┌───────────────────────────────────────┐  │
│  │          Save & Continue              │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘

Leaders Tray expanded:

┌─────────────────────────────────────────────┐
│ Leaders Tray                                │
├─────────────────────────────────────────────┤
│ [PPG | RPG | APG | SPG | BPG | 3PM | ...]   │
│   ▔▔▔                                       │
│                                             │
│ ← ┌──────┐┌──────┐┌──────┐┌──────┐ →       │
│   │Luka  ││Embiid││SGA   ││Giannis│        │
│   │33.4  ││29.8  ││29.5  ││28.9   │        │
│   │      ││      ││      ││       │        │
│   │ Drag ││ Drag ││ Drag ││ Drag  │        │
│   └──────┘└──────┘└──────┘└──────┘        │
│                                             │
└─────────────────────────────────────────────┘
```

### 11.4 Run Previous Slate → Results

```
┌─────────────────────────────────────────────┐
│ Home Page                                   │
├─────────────────────────────────────────────┤
│                                             │
│           Welcome Back, Chad                │
│                                             │
│    Your watchability profile is ready       │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │                                       │  │
│  │       RUN PREVIOUS SLATE              │  │
│  │                                       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│            [Tap to run]                     │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Loading State                               │
├─────────────────────────────────────────────┤
│                                             │
│                                             │
│              🏀 (bouncing)                  │
│                                             │
│         Analyzing the slate...              │
│                                             │
│              ●●○○○                          │
│                                             │
│                                             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ ← Back              Results                 │
├─────────────────────────────────────────────┤
│                                             │
│  "Playoff intensity starts to build."       │
│                                             │
│  Slate: Dec 19, 07:30 - Dec 20, 07:30       │
│  5 games                                    │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │         Share This List 📤            │  │
│  └───────────────────────────────────────┘  │
│                                             │
├─────────────────────────────────────────────┤
│ YOUR RANKED GAMES                           │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ ●1  Thunder at Timberwolves           │  │
│  │                                       │  │
│  │ late drama • big momentum swing       │  │
│  │ playoff-style intensity               │  │
│  │                                       │  │
│  │ 📺 Watch: 4th quarter full            │  │
│  │                                       │  │
│  │ ┌─────────────────────────────────┐   │  │
│  │ │      Watch Now →                │   │  │
│  │ └─────────────────────────────────┘   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ ●2  76ers at Knicks                   │  │
│  │ ...                                   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ...                                        │
│                                             │
│  Scroll down for Discovery picks ↓          │
│                                             │
└─────────────────────────────────────────────┘
```

### 11.5 Share Creation Flow

```
┌─────────────────────────────────────────────┐
│ Results Page                                │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │         Share This List 📤            │  │ ← User taps
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Share Modal                                 │
├─────────────────────────────────────────────┤
│                                             │
│  Creating your shareable list...            │
│                                             │
│              ●●●○○                          │
│                                             │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Share Options                               │
├─────────────────────────────────────────────┤
│                                             │
│  Your shareable link:                       │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │ watchability.app/share/4b19c          │  │
│  │                              [Copy]   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │         Copy Link                     │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │         Share via...                  │  │
│  │  [Twitter] [WhatsApp] [Message]       │  │
│  └───────────────────────────────────────┘  │
│                                             │
│             [Close]                         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 12. Responsive Design Breakpoints

```css
/* Mobile First (default) */
/* 320px - 639px */

/* Small tablets */
@media (min-width: 640px) {
  /* sm: tablets portrait */
  .container {
    max-width: 640px;
  }

  .setup-choice {
    grid-template-columns: 1fr 1fr;
  }
}

/* Tablets landscape */
@media (min-width: 768px) {
  /* md: tablets landscape */
  .container {
    max-width: 768px;
  }

  .team-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Desktop */
@media (min-width: 1024px) {
  /* lg: desktop */
  .container {
    max-width: 1024px;
  }

  .division-view {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Large desktop */
@media (min-width: 1280px) {
  /* xl: large desktop */
  .container {
    max-width: 1280px;
  }
}
```

---

## 13. Implementation Checklist

### Phase 1: Foundation

- [ ] Set up design tokens (CSS variables)
- [ ] Create base typography styles
- [ ] Implement color system
- [ ] Build spacing utilities
- [ ] Set up animation system
- [ ] Create accessibility foundation (focus styles, skip links)

### Phase 2: Core Components

- [ ] Button (all variants)
- [ ] Card
- [ ] Tag
- [ ] LoadingSpinner (NBA Jam style)
- [ ] EmptyState
- [ ] Slider (with live feedback)

### Phase 3: Drag-and-Drop

- [ ] DraggableList component
- [ ] TeamCard (draggable)
- [ ] PlayerCard (draggable)
- [ ] DropZone component
- [ ] Keyboard navigation for drag-and-drop
- [ ] Touch optimization

### Phase 4: Pages

- [ ] Home Page
- [ ] Onboarding (Welcome + Setup Choice)
- [ ] Team Preferences (League/Conference/Division views)
- [ ] Player Preferences (Buckets + Search + Leaders)
- [ ] Style Preferences (Sliders + Preview)
- [ ] Results Page (Ranked games + Discovery)
- [ ] Share Page (Read-only view)

### Phase 5: Interactions & Polish

- [ ] Page transitions
- [ ] Micro-interactions (hover states, success feedback)
- [ ] Loading states for all async operations
- [ ] Error states
- [ ] Toast notifications
- [ ] Mobile gesture support

### Phase 6: Accessibility Audit

- [ ] Keyboard navigation test
- [ ] Screen reader test (NVDA, JAWS, VoiceOver)
- [ ] Color contrast audit
- [ ] Touch target size verification
- [ ] Reduced motion support
- [ ] ARIA labels and live regions

### Phase 7: Performance Optimization

- [ ] Image optimization (WebP, lazy loading)
- [ ] Code splitting
- [ ] Bundle size analysis
- [ ] Animation performance audit
- [ ] Mobile performance testing

---

## 14. Design Assets Needed

### Illustrations & Graphics

1. **Welcome Screen Hero**
   - NBA Jam-inspired illustration
   - Basketball court background
   - Stylized player silhouettes

2. **Loading Animation**
   - Bouncing basketball sprite
   - "He's heating up" progression

3. **Empty States**
   - No games illustration
   - Empty bucket illustration
   - No profile illustration

4. **Share Page Avatar**
   - Cartoon avatar generator
   - GOAT jersey customization
   - Team color variations

### Icons

```
Required icons (24x24, SVG):
- Menu (hamburger)
- Close (X)
- Search (magnifying glass)
- Drag handle (☰)
- Play (triangle)
- Share (export arrow)
- Check (success)
- Error (exclamation)
- Info (i)
- Arrow up/down/left/right
- Chevron up/down
- Star (filled/outline)
- Fire
- Trophy (GOAT)
- Basketball
```

### Team Logos

```
All 30 NBA teams:
- Format: SVG (vector) + WebP (raster fallback)
- Sizes: 48x48, 96x96, 192x192 (for Retina)
- Transparent background
- Official team colors
```

### Player Headshots

```
Format: WebP
Size: 224x224 (displays at 112x112 @ 2x)
Shape: Circular crop
Fallback: Generic silhouette
```

---

## Conclusion

This design system provides a comprehensive foundation for implementing the NBA Spoiler-Free Watchability App with a cohesive, playful, and accessible user experience. The NBA Jam-inspired aesthetic combined with modern UX patterns creates a unique product that makes the morning check-in ritual feel fun and effortless.

**Key Takeaways:**

1. **Mobile-first, thumb-optimized** design ensures the core use case (morning check-in on phone) is seamless
2. **Drag-and-drop interactions** make preference configuration playful, not tedious
3. **Spoiler-free-first** design language baked into every component and interaction
4. **NBA Jam aesthetic** brings energy and personality to a functional tool
5. **Accessibility-first** approach ensures the app works for everyone
6. **Performance-optimized** for fast load times and smooth interactions on mobile

All component specifications, design tokens, and interaction patterns are production-ready and can be implemented directly by frontend developers without additional design decisions.

---

**Document Version:** 1.0
**Last Updated:** 2025-12-20
**Next Review:** After Phase 1 Implementation
