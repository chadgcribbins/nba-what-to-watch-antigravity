import { Game, RankedGame, WatchSuggestion, UserPreferences } from '@/types/schema';
import { safetyScrub } from '@/lib/safety/scrub';
import { SAFE_TAGS, NARRATIVE_TEMPLATES, NARRATIVE_DETAIL_TEMPLATES } from '@/lib/safety/spoilers';
import { ALL_PLAYERS } from '@/lib/data/allPlayers';

// Internal interface for scorer logic
interface InternalPreferences extends UserPreferences {
    teamWeights?: Record<number, number>;
}

export function rankGames(games: Game[], prefs?: UserPreferences): RankedGame[] {
    // 1. Convert teamRanks to weights if present
    const teamWeights: Record<number, number> = {};
    if (prefs?.teamRanks) {
        prefs.teamRanks.forEach((teamId, index) => {
            teamWeights[teamId] = 30 - index;
        });
    }

    // 2. Score each game
    const safePrefs: InternalPreferences = {
        ...(prefs || {
            teamRanks: [],
            playerBuckets: { mustSee: [], villain: [], hooper: [] },
            style: {
                pace: 3,
                ballMovement: 3,
                pointsVibe: 3,
                shotProfile: 3,
                vibe: 3,
                bangMeter: 3,
                deskHeat: 3
            },
            powerups: {
                rivalriesMatter: false,
                superstarShowcases: false,
                discoveryMode: true
            },
            isSyncingToStandings: true
        }),
        teamWeights
    };

    const scored = games.map(g => {
        const score = calculateWatchabilityScore(g, safePrefs);
        return { game: g, score };
    });

    // 3. Sort by score
    const ranked = scored.sort((a, b) => b.score - a.score).map((s, i) => {
        const game = s.game;
        const score = s.score;

        return {
            ...game,
            watchabilityScore: score,
            rank: i + 1,
            narrativeHeadline: generateNarrativeHeadline(game, score),
            discoveryNote: generateDiscoveryNote(game, safePrefs),
            tags: generateTags(game, score),
            suggestion: determineSuggestion(score, game)
        };
    });

    return ranked;
}

function calculateWatchabilityScore(game: Game, prefs: InternalPreferences): number {
    if (!game.signals) return 50;

    const s = game.signals;

    // 1. INTENSITY SCORE (Up to 40 pts)
    const clutchScore = (s.clutchIndex ?? 0) * 20;
    const swingScore = (s.swingIndex ?? 0) * 10;
    const comebackScore = (s.comebackIndex ?? 0) * 10;
    const intensityScore = clutchScore + swingScore + comebackScore;

    // 2. MATCHUP QUALITY (Up to 25 pts)
    const matchupScore = (s.teamQualityIndex ?? 0.5) * 25;

    // 3. STORY/STORYLINE (Up to 15 pts)
    const storyScore = (s.isOT ? 10 : 0) + (s.isCloseGame ? 5 : 0);

    // 4. STYLE TUNING (tiebreakers up to ±6)
    let stylePoints = 0;
    const style = prefs.style || { pace: 3, ballMovement: 3, pointsVibe: 3, shotProfile: 3, vibe: 3, bangMeter: 3, deskHeat: 3 };

    const getPref = (val: number) => (val - 3) / 2; // Converts 1..5 to -1..1
    const getSig = (val: number) => (2 * val) - 1;   // Converts 0..1 to -1..1

    stylePoints += 1.25 * getPref(style.pace) * getSig(s.paceIndex ?? 0.5);
    stylePoints += 1.25 * getPref(style.ballMovement) * getSig(s.ballMovementIndex ?? 0.5);
    stylePoints += 1.5 * getPref(style.pointsVibe) * getSig(s.defenseIndex ?? 0.5);
    stylePoints += 1.0 * getPref(style.shotProfile) * getSig(s.shotProfileIndex ?? 0.5);
    const chaosSignal = Math.max(s.swingIndex ?? 0, s.leadChangeIndex ?? 0);
    stylePoints += 1.0 * getPref(style.vibe) * getSig(chaosSignal);
    stylePoints += 0.75 * getPref(style.bangMeter) * getSig(s.broadcastHypeIndex ?? 0.5);
    stylePoints += 0.75 * getPref(style.deskHeat) * getSig(s.studioBuzzIndex ?? 0.5);

    const styleBonus = Math.max(-6, Math.min(6, stylePoints));

    // 5. PENALTIES
    const blowoutPenalty = s.isBlowout ? (s.blowoutIndex * 20) : 0;

    // 6. BIAS BONUSES
    // Team Preference (Light spread +10 max)
    const homeWeight = (prefs.teamWeights?.[game.homeTeam.id] || 0) / 30;
    const awayWeight = (prefs.teamWeights?.[game.awayTeam.id] || 0) / 30;
    const teamBonus = 10 * Math.max(homeWeight, awayWeight);

    // Player Bias
    const mustSeeCount = game.lineup?.filter(pid => prefs.playerBuckets.mustSee.includes(pid)).length ?? 0;
    const favoriteBonus = Math.min(10, mustSeeCount * 4);

    // GOAT Bonus (The #1 priority)
    const isGoatPlaying = game.lineup?.includes(prefs.goatId || '');
    const goatBonus = isGoatPlaying ? 12 : 0;

    const villainCount = game.lineup?.filter(pid => (prefs.playerBuckets.villain ?? []).includes(pid)).length ?? 0;
    const villainPenalty = Math.min(8, villainCount * 3);

    // 7. POWER-UPS
    const rivalryBonus = (prefs.powerups?.rivalriesMatter && s.rivalryIndex) ? (s.rivalryIndex * 4) : 0;
    const starDuelBonus = (prefs.powerups?.superstarShowcases && s.starDuelIndex) ? (s.starDuelIndex * 4) : 0;
    const discoveryBonus = (prefs.powerups?.discoveryMode) ? 2 : 0;

    const finalScore = intensityScore + matchupScore + storyScore + styleBonus + teamBonus + favoriteBonus + goatBonus + rivalryBonus + starDuelBonus + discoveryBonus - blowoutPenalty - villainPenalty;

    // Use a tiny deterministic jitter based on sourceId to prevent visual ties from being absolute ties in sorting
    const jitter = (game.sourceId % 1000) / 10000;

    return Math.max(0, Math.min(100, finalScore + jitter));
}

function generateDiscoveryNote(game: Game, prefs: UserPreferences): string | undefined {
    if (game.status === 'Scheduled' || !prefs.powerups?.discoveryMode) return undefined;

    const s = game.signals;
    if (!s) return undefined;

    const allGamePlayers = ALL_PLAYERS.filter(p => p.teamId === game.homeTeam.id || p.teamId === game.awayTeam.id);
    const hasHooper = allGamePlayers.some(p => prefs.playerBuckets?.hooper.includes(p.id));

    if (s.teamQualityIndex < 0.3) {
        return safetyScrub(NARRATIVE_DETAIL_TEMPLATES.ROOKIE_TEASER[Math.floor(Math.random() * NARRATIVE_DETAIL_TEMPLATES.ROOKIE_TEASER.length)]);
    }

    if (hasHooper || s.clutchIndex > 0.7) {
        return safetyScrub(NARRATIVE_DETAIL_TEMPLATES.STAR_TEASER[Math.floor(Math.random() * NARRATIVE_DETAIL_TEMPLATES.STAR_TEASER.length)]
            .replace("[City]", game.homeTeam.city));
    }

    if (s.hasHighScoring) {
        return safetyScrub("High tempo and offensive rhythm defining the pace");
    }

    return safetyScrub("A specific rotation piece is center stage tonight");
}

function generateNarrativeHeadline(game: Game, score: number): string {
    const s = game.signals;
    if (!s) return `The ${game.awayTeam.name} visit the ${game.homeTeam.name} `;

    let category: keyof typeof NARRATIVE_TEMPLATES = 'STANDARD';

    if (game.status === 'Scheduled') {
        category = 'PREGAME';
    } else if (s.clutchIndex > 0.7 || s.swingIndex > 0.7) {
        category = 'CLUTCH';
    } else if (s.teamQualityIndex > 0.8) {
        category = 'HEAVYWEIGHT';
    } else if (s.hasHighScoring && s.clutchIndex < 0.3) {
        category = 'FRENETIC';
    } else if (score < 40 && s.blowoutIndex < 0.3) {
        category = 'GRIT';
    }

    const templates = NARRATIVE_TEMPLATES[category];
    const template = templates[Math.floor((game.sourceId % 100) / 100 * templates.length)];

    return safetyScrub(template
        .replace("[Away]", game.awayTeam.name)
        .replace("[Home]", game.homeTeam.name)
        .replace("[City]", game.homeTeam.city)
        .replace("[Division]", game.homeTeam.division)
        .replace("[Conference]", game.homeTeam.conference));
}

function generateTags(game: Game, score: number): string[] {
    const s = game.signals;
    if (!s) return ["background watch"];

    const categorized: { drama: string[], matchup: string[], style: string[], story: string[], low: string[] } = {
        drama: [],
        matchup: [],
        style: [],
        story: [],
        low: []
    };

    if (s.clutchIndex > 0.8) categorized.drama.push(SAFE_TAGS.DRAMA[1]);
    if (s.clutchIndex > 0.6) categorized.drama.push(SAFE_TAGS.DRAMA[0]);
    if (s.swingIndex > 0.75) categorized.drama.push(SAFE_TAGS.DRAMA[2]);
    if (s.comebackIndex > 0.7) categorized.drama.push(SAFE_TAGS.DRAMA[3]);

    if (s.teamQualityIndex > 0.85) categorized.matchup.push(SAFE_TAGS.MATCHUP[1]);
    if (s.teamQualityIndex > 0.75) categorized.matchup.push(SAFE_TAGS.MATCHUP[0]);
    if (s.teamQualityIndex > 0.8) categorized.matchup.push(SAFE_TAGS.MATCHUP[5]);

    if (s.hasHighScoring) categorized.style.push(SAFE_TAGS.STYLE[0]);
    if (s.hasHighScoring) categorized.style.push(SAFE_TAGS.STYLE[1]);
    if (score > 80 && s.clutchIndex < 0.5) categorized.style.push(SAFE_TAGS.STYLE[2]);

    if (score > 90) categorized.story.push(SAFE_TAGS.STORYLINE[3]);
    if (score > 70) categorized.story.push(SAFE_TAGS.STORYLINE[0]);

    if (game.status === 'Scheduled') {
        const potential = [...SAFE_TAGS.PREGAME_HYPE, ...categorized.matchup];
        return potential.slice(0, 3);
    }

    if (s.blowoutIndex > 0.8) categorized.low.push(SAFE_TAGS.LOW_SUSPENSE[0]);
    if (s.blowoutIndex > 0.6) categorized.low.push(SAFE_TAGS.LOW_SUSPENSE[1]);
    if (s.blowoutIndex > 0.4) categorized.low.push(SAFE_TAGS.LOW_SUSPENSE[3]);

    let finalTags: string[] = [];
    const isLowSuspense = categorized.low.length > 0;
    if (isLowSuspense) {
        finalTags.push(categorized.low[0]);
        const potential = [...categorized.matchup, ...categorized.style, ...categorized.story];
        finalTags = [...finalTags, ...potential.slice(0, 2)];
    } else {
        finalTags = [
            ...categorized.drama.slice(0, 2),
            ...categorized.matchup.slice(0, 1),
            ...categorized.style.slice(0, 1),
            ...categorized.story.slice(0, 1)
        ];
    }

    if (finalTags.length < 2) {
        if (!isLowSuspense) finalTags.push(SAFE_TAGS.STYLE[1]);
        else finalTags.push(SAFE_TAGS.LOW_SUSPENSE[1]);
    }

    if (score > 85 && game.status === 'Final') {
        finalTags.unshift(safetyScrub('BOOMSHAKALAKA!'));
    }

    const limit = isLowSuspense ? 3 : 4;
    return finalTags.slice(0, limit);
}

function determineSuggestion(score: number, game: Game): WatchSuggestion {
    if (game.status === 'Scheduled') return 'set a reminder' as any;
    const s = game.signals;
    if (!s) return 'condensed is enough';

    if (s.blowoutIndex >= 0.90) return 'skip';
    if (s.blowoutIndex >= 0.70) return 'condensed is enough';

    if (s.clutchIndex >= 0.75 || s.swingIndex >= 0.75) return 'watch 4th quarter full';

    if (score >= 85 && s.blowoutIndex < 0.35) return 'full game';

    return 'condensed is enough';
}
