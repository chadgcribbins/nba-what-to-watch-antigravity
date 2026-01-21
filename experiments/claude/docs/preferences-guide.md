# Preferences Guide

## How to Fine-Tune the Watchability Algorithm

The NBA Watchability app uses your preferences to personalize game rankings while keeping objective quality as the primary factor. Here's how to configure your profile:

### Accessing Preferences

1. Visit **http://localhost:3003/preferences**
2. Or click "Configure your preferences →" on the home page

---

## 🎨 Style Preferences (Available Now!)

Fine-tune what types of games you enjoy watching. These are **tiebreakers** when games have similar objective quality scores.

### Available Sliders (0-100 scale)

#### 1. Offense vs Defense
- **0 (Left)**: Love defensive battles, low-scoring grind-it-out games
- **50 (Center)**: Neutral - enjoy both styles equally
- **100 (Right)**: Love shootouts, high-scoring offensive showcases

**How it affects rankings:**
- High-scoring games (230+ points) get a +5 boost if you prefer offense (>60)
- Low-scoring games (<200 points) get a +5 boost if you prefer defense (<40)

#### 2. Game Pace
- **0 (Left)**: Prefer slow, methodical, half-court basketball
- **50 (Center)**: Neutral
- **100 (Right)**: Love fast-paced, up-tempo, run-and-gun style

**Note:** Full implementation coming soon with pace stats from ESPN

#### 3. Ball Movement
- **0 (Left)**: Don't care about assists or ball movement
- **50 (Center)**: Neutral
- **100 (Right)**: Love team basketball with lots of passing

**Note:** Full implementation coming soon with assist stats

#### 4. Star Power
- **0 (Left)**: Love balanced team efforts where everyone contributes
- **50 (Center)**: Neutral
- **100 (Right)**: Love individual star performances and hero ball

**Note:** Full implementation coming soon with player stats

#### 5. Physicality
- **0 (Left)**: Prefer finesse, skill-based basketball
- **50 (Center)**: Neutral
- **100 (Right)**: Love physical, chippy, playoff-intensity games

**Note:** Full implementation coming soon with foul/physical play stats

---

## 👥 Team Rankings (Coming Soon)

Rank all 30 NBA teams from your favorite (#1) to least favorite (#30).

### How Team Rankings Affect Scores

- **Rank 1 (Favorite)**: Games featuring this team get +15 points
- **Rank 2-5**: +10 to +12 points
- **Rank 6-10**: +6 to +9 points
- **Rank 11-20**: +3 to +5 points
- **Rank 21-30**: +0 to +2 points

**Important:** Team preference is a **tiebreaker only**. A boring blowout featuring your favorite team won't suddenly become must-watch.

### Example
- Your favorite team (Lakers) plays a boring 25-point blowout
- Base score: 30 (low drama)
- Team boost: +15
- **Final score: 45** (still ranked below exciting games)

---

## 🏀 Player Buckets (Coming Soon)

Organize players into emotional categories that affect rankings:

### ⭐ Must-See TV
**What it means:** Players you tune in on purpose

**Effect:** Games with notable performances get **+15 points**

**Rule:** Boost only applies when:
- Player has a storyline (revenge game, milestone watch, etc.), OR
- Player has a notable performance (30+ points, triple-double, etc.)

**Why:** We don't want to boost boring games just because your favorite played 12 minutes off the bench.

### 🏀 Hooper
**What it means:** Players you respect and enjoy watching

**Effect:** Games with notable performances get **+8 points**

**Rule:** Same as Must-See TV but with lighter boost

### 😈 Villain
**What it means:** Players you root against

**Effect:** Games featuring these players get **-15 points**, even if objectively good

**Why:** Some games aren't worth it if you don't enjoy the characters involved. This reflects real fan behavior.

**Exception:** Truly exceptional games (score >85) only get -5 penalty

### 🐐 GOAT (Optional)
**What it means:** Your all-time favorite player

**Effect:** Games featuring this player get **+20 points**

**Limit:** Only ONE player can be your GOAT

---

## 🎯 How Personalization Works

### The Formula

```
Total Score = Objective Quality (0-100) + Personalization (-15 to +50)
```

### Objective Quality Components (60-100 points)
1. **Drama Score (0-40)**: Close games, lead changes, competitive quarters
2. **Star Performance (0-30)**: 40+ point games, triple-doubles, career highs
3. **Storyline (0-20)**: Rivalries, revenge games, playoff implications
4. **Pace & Style (0-10)**: Matches your style preferences

### Personalization Boost (-15 to +50)
- Favorite team: +5 to +15
- Must-see player: +15
- Hooper player: +8
- Villain player: -15
- GOAT player: +20

### Example Calculation

**Game: Lakers vs Celtics (rivalry)**
- Base drama: 35 (close game, 4-point margin)
- Star performance: 20 (LeBron 32 pts)
- Storyline: 15 (historic rivalry)
- Style match: 8 (high pace, you love it)
- **Objective total: 78**

**Your preferences:**
- Lakers are your #1 team: +15
- LeBron is your GOAT: +20
- **Personalization: +35**

**Final Score: 113** → Must-watch game!

---

## 💡 Best Practices

### 1. Start Neutral
Keep all sliders at 50 initially. Run a few slates and see what the algorithm recommends.

### 2. Make Small Adjustments
Move sliders 10-20 points at a time. The algorithm is sensitive to your preferences.

### 3. Don't Over-Personalize
If you boost too many teams/players, everything becomes "must-watch" and rankings lose meaning.

**Recommended limits:**
- Must-See TV: 3-5 players
- Hooper: 5-10 players
- Villain: 1-3 players
- GOAT: 1 player only

### 4. Trust Objective Quality
The algorithm prioritizes drama and game quality. Your preferences are tiebreakers, not overrides.

### 5. Experiment!
Try different settings and see how rankings change. Your perfect configuration is unique to you.

---

## 🔧 Technical Details

### Storage
- Preferences stored in **localStorage** (browser-based)
- Persists across sessions
- No account required (MVP)
- Export/import coming soon for backup

### Privacy
- All data stays on your device
- No tracking or analytics
- No server-side storage (MVP)

### Performance
- Preferences loaded on page load
- Sent to API with each slate request
- Minimal impact on generation time (<50ms)

---

## 🚀 Coming Soon

### V1 Features
- **Drag-and-drop team ranking** interface
- **Player search** with autocomplete
- **Advanced weights** for power users
- **Multiple profiles** (work vs personal)
- **Profile sharing** via URL
- **Cloud sync** across devices

### V2 Features
- **Machine learning** to auto-tune preferences based on your viewing history
- **Social features**: Compare preferences with friends
- **Recommendations**: "Users like you also enjoy..."

---

## 📊 Current Status

✅ **Working:**
- Style preference sliders
- Profile storage (localStorage)
- Profile integration with slate API
- Real-time updates

🚧 **In Progress:**
- Team ranking UI
- Player bucket UI
- Full stat integration for style matching

📋 **Planned:**
- Export/import profiles
- Multiple profiles
- Cloud sync
- Advanced tuning

---

## Need Help?

The preferences system is designed to be intuitive, but if you have questions:

1. Check the tooltips on each slider
2. Review the examples in this guide
3. Start with defaults and adjust gradually
4. Remember: Objective quality always comes first!





