import { z } from 'zod';

// --- Primitives ---

export const TeamSchema = z.object({
    id: z.number(),
    abbreviation: z.string(),
    city: z.string(),
    conference: z.string(),
    division: z.string(),
    full_name: z.string(),
    name: z.string(),
    logoUrl: z.string().optional(),
});

export type Team = z.infer<typeof TeamSchema>;

export const PlayerSchema = z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    position: z.string(),
    team: TeamSchema,
});

export type Player = z.infer<typeof PlayerSchema>;

// --- API Responses (Balldontlie) ---

export const BDLGameSchema = z.object({
    id: z.number(),
    date: z.string(),
    home_team: TeamSchema,
    visitor_team: TeamSchema,
    home_team_score: z.number(),
    visitor_team_score: z.number(),
    period: z.number(),
    status: z.string(),
    time: z.string().nullable().optional(),
    postseason: z.boolean().optional(),
});

export type BDLGame = z.infer<typeof BDLGameSchema>;

// --- Internal Domain Models ---

export const GameStatusSchema = z.enum(['Scheduled', 'Live', 'Final', 'Postponed']);

export const GameSchema = z.object({
    id: z.string(), // "nba_{date}_{away}_{home}"
    sourceId: z.number(), // BDL ID
    startTime: z.string(), // ISO
    endTime: z.string().optional(),

    homeTeam: TeamSchema,
    awayTeam: TeamSchema,

    // HIDDEN FROM USER IN RANKED VIEW
    homeScore: z.number(),
    awayScore: z.number(),
    status: GameStatusSchema,
    period: z.number(),
    nbaId: z.string().optional(), // NBA.com Game ID for direct linking

    // Signals for ranking (0-1 scale where applicable)
    signals: z.object({
        // Drama (Indices 0.0 - 1.0)
        clutchIndex: z.number().default(0),
        leadChangeIndex: z.number().default(0),
        swingIndex: z.number().default(0),
        comebackIndex: z.number().default(0),
        dramaScore: z.number().default(0), // 0-100

        // Style / Aesthetic Signals (0.0 - 1.0) -- FOR STYLE TUNING
        paceIndex: z.number().default(0.5),         // 0=Halfcourt, 1=Run&Gun
        ballMovementIndex: z.number().default(0.5), // 0=ISO, 1=Team
        shotProfileIndex: z.number().default(0.5),  // 0=Rim, 1=3pt
        defenseIndex: z.number().default(0.5),      // 0=Grind, 1=Shootout (Proxies Off/Def balance)

        // Narrative / Meta Signals
        teamQualityIndex: z.number().default(0.5),
        matchupQuality: z.number().default(0),
        broadcastHypeIndex: z.number().default(0.5), // "Bang Meter"
        studioBuzzIndex: z.number().default(0.5),    // "Desk Heat"
        rivalryIndex: z.number().default(0),        // 0-1 (Rivalry/Rematch intensity)
        starDuelIndex: z.number().default(0),       // 0-1 (Superstar matchup strength)

        // Flags
        isOT: z.boolean().default(false),
        isCloseGame: z.boolean().default(false),
        isBlowout: z.boolean().default(false),
        blowoutIndex: z.number().default(0),
        hasHighScoring: z.boolean().default(false),
        topPerformers: z.array(z.string()).optional(),
    }).optional(),

    lineup: z.array(z.string()).optional(), // Array of player IDs effectively playing in this game
    watchLinks: z.object({
        webFallback: z.string(),
        primary: z.string().optional(),
        espn: z.string().optional()
    }).optional(),
});

export type Game = z.infer<typeof GameSchema>;

// ... (omitted sections)

export interface UserPreferences {
    teamRanks: number[];
    playerBuckets: {
        mustSee: string[];
        villain: string[];
        hooper: string[];
    };
    goatId?: string | null;
    // Style Tuning v1 Spec
    style: {
        pace: number;          // 1-5
        ballMovement: number;  // 1-5
        pointsVibe: number;    // 1-5 (Shootout vs Grind)
        shotProfile: number;   // 1-5
        vibe: number;          // 1-5 (Chaos Tolerance)
        bangMeter: number;     // 1-5 (Broadcast Hype)
        deskHeat: number;      // 1-5 (Studio Buzz)
    };
    powerups: {
        rivalriesMatter: boolean;
        superstarShowcases: boolean;
        discoveryMode: boolean;
    };
    picks?: Record<string, number>; // gameId -> teamId
    profile?: {
        displayName: string;
        avatarTemplate: string; // e.g. 'goated-jam'
        email?: string;
    };
    isSyncingToStandings: boolean;
    stats?: {
        slatesRun: number;
        watchTimeMinutes: number;
        picksRecord?: {
            correct: number;
            total: number;
        };
    };
    reminders?: string[]; // gameIds to be notified about
}

export type WatchSuggestion = 'skip' | 'condensed is enough' | 'watch 4th quarter full' | 'full game' | 'set a reminder';

export interface RankedGame extends Game {
    watchabilityScore: number;
    rank: number;
    rivalryIndex?: number;
    starDuelIndex?: number;
    // Percentage stats for tray sort
    fgPct?: number;
    threePtPct?: number;
    ftPct?: number;
    narrativeHeadline: string;
    discoveryNote?: string;
    tags: string[];
    suggestion: WatchSuggestion;
}
