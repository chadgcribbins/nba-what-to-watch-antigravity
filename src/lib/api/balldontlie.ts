import { BDLGame, BDLGameSchema, Game, GameStatusSchema, Team } from '@/types/schema';
import { ALL_TEAMS } from '@/lib/data/allTeams';
import { format, subDays } from 'date-fns';

const API_KEY = process.env.BALLDONTLIE_API_KEY;
const BASE_URL = 'https://api.balldontlie.io/v1';

export async function fetchGames(date: Date): Promise<Game[]> {
    const dateStr = format(date, 'yyyy-MM-dd');

    if (!API_KEY) {
        console.warn('BALLDONTLIE_API_KEY not found. Using mock data.');
        return getMockGames(dateStr);
    }

    try {
        const res = await fetch(`${BASE_URL}/games?dates[]=${dateStr}`, {
            headers: {
                'Authorization': API_KEY,
            },
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch games: ${res.statusText}`);
        }

        const data = await res.json();
        const games = data.data; // BDL response format

        return games.map((g: any) => normalizeGame(g));
    } catch (error) {
        console.error('Error fetching games:', error);
        return getMockGames(dateStr);
    }
}

function normalizeGame(bdlGame: any): Game {
    // Validate with Zod first
    const parsed = BDLGameSchema.safeParse(bdlGame);
    if (!parsed.success) {
        console.error('Invalid game data:', parsed.error);
        throw new Error('Invalid game data from API');
    }
    const g = parsed.data;

    const diff = Math.abs(g.home_team_score - g.visitor_team_score);
    const totalPoints = g.home_team_score + g.visitor_team_score;

    // Enhanced Drama Heuristic
    let dramaScore = 0;
    if (diff <= 3) dramaScore = 95;
    else if (diff <= 7) dramaScore = 80;
    else if (diff <= 12) dramaScore = 50;
    else dramaScore = 20;

    // Bonus for high scoring/overtime (if we can detect OT)
    if (totalPoints > 240) dramaScore += 5;

    return {
        id: `nba_${g.date.slice(0, 10).replace(/-/g, '')}_${g.visitor_team.abbreviation}_${g.home_team.abbreviation}`,
        sourceId: g.id,
        startTime: g.date,
        homeTeam: resolveTeam(g.home_team),
        awayTeam: resolveTeam(g.visitor_team),
        homeScore: g.home_team_score,
        awayScore: g.visitor_team_score,
        status: mapStatus(g.status),
        period: g.period,
        signals: {
            clutchIndex: diff <= 5 ? 0.8 : 0.2,
            leadChangeIndex: diff <= 8 ? 0.6 : 0.1,
            swingIndex: diff <= 5 ? 0.7 : 0.2,
            comebackIndex: 0.3,
            teamQualityIndex: 0.5,
            matchupQuality: 0.45, // Placeholder
            isOT: g.period > 4,
            isCloseGame: diff <= 5,
            isBlowout: diff >= 20,
            blowoutIndex: Math.min(1, diff / 25),
            hasHighScoring: totalPoints > 230,
            dramaScore: Math.min(100, dramaScore),
            paceIndex: 0.5,
            ballMovementIndex: 0.5,
            shotProfileIndex: 0.5,
            defenseIndex: 0.5,
            broadcastHypeIndex: 0.5,
            studioBuzzIndex: 0.5,
            rivalryIndex: 0,
            starDuelIndex: 0
        },
        watchLinks: {
            webFallback: `https://www.espn.com/nba/game/_/gameId/${g.id}`
        }
    };
}

function mapStatus(status: string): 'Scheduled' | 'Live' | 'Final' | 'Postponed' {
    if (status === 'Final') return 'Final';
    if (status.includes('Q') || status.includes('Half')) return 'Live';
    if (status.includes(':')) return 'Scheduled'; // e.g. "8:00 PM ET"
    return 'Scheduled';
}

/**
 * Enriches BDL team data with our local metadata (logos, full names)
 * and handles abbreviation mismatches.
 */
function resolveTeam(bdlTeam: any): Team {
    const abbrev = bdlTeam.abbreviation;

    // 1. Handle Known Mismatches
    const abbrevMap: Record<string, string> = {
        'NY': 'NYK',
        'SA': 'SAS',
        'GS': 'GSW',
        'UT': 'UTA',
        'NO': 'NOP',
        'WSH': 'WAS'
    };

    const targetAbbrev = abbrevMap[abbrev] || abbrev;

    // 2. Find in our local DB
    const found = ALL_TEAMS.find(t =>
        t.abbreviation === targetAbbrev ||
        t.full_name.toLowerCase() === bdlTeam.full_name.toLowerCase()
    );

    if (found) {
        return {
            ...bdlTeam,
            ...found, // Spread local data over API data to get logos/names
            id: bdlTeam.id // Keep original API ID
        };
    }

    return bdlTeam;
}

// --- MOCK DATA ---

function getMockGames(dateStr: string): Game[] {
    // Return a slate of mock games for demo purposes
    return [
        {
            id: `nba_${dateStr.replace(/-/g, '')}_OKC_MIN`,
            sourceId: 101,
            startTime: `${dateStr}T20:00:00Z`,
            homeTeam: resolveTeam({ id: 18, abbreviation: 'MIN', city: 'Minnesota', conference: 'West', division: 'Northwest', full_name: 'Minnesota Timberwolves', name: 'Timberwolves' }),
            awayTeam: resolveTeam({ id: 21, abbreviation: 'OKC', city: 'Oklahoma City', conference: 'West', division: 'Northwest', full_name: 'Oklahoma City Thunder', name: 'Thunder' }),
            homeScore: 112,
            awayScore: 115,
            status: 'Final',
            period: 4,
            signals: {
                clutchIndex: 0.9,
                leadChangeIndex: 0.8,
                swingIndex: 0.8,
                comebackIndex: 0.5,
                teamQualityIndex: 0.9,
                matchupQuality: 0.85,
                isOT: false,
                isCloseGame: true,
                isBlowout: false,
                blowoutIndex: 0.1,
                hasHighScoring: true,
                dramaScore: 95,
                paceIndex: 0.7,
                ballMovementIndex: 0.8,
                shotProfileIndex: 0.6,
                defenseIndex: 0.4,
                broadcastHypeIndex: 0.9,
                studioBuzzIndex: 0.8,
                rivalryIndex: 1.0,
                starDuelIndex: 0.9
            },
            watchLinks: {
                webFallback: `https://www.nba.com/game/101`
            }
        },
        {
            id: `nba_${dateStr.replace(/-/g, '')}_PHI_NYK`,
            sourceId: 102,
            startTime: `${dateStr}T19:30:00Z`,
            homeTeam: resolveTeam({ id: 20, abbreviation: 'NY', city: 'New York', conference: 'East', division: 'Atlantic', full_name: 'New York Knicks', name: 'Knicks' }),
            awayTeam: resolveTeam({ id: 23, abbreviation: 'PHI', city: 'Philadelphia', conference: 'East', division: 'Atlantic', full_name: 'Philadelphia 76ers', name: '76ers' }),
            homeScore: 105,
            awayScore: 102,
            status: 'Final',
            period: 4,
            signals: {
                clutchIndex: 0.8,
                leadChangeIndex: 0.7,
                swingIndex: 0.6,
                comebackIndex: 0.2,
                teamQualityIndex: 0.8,
                matchupQuality: 0.75,
                isOT: false,
                isCloseGame: true,
                isBlowout: false,
                blowoutIndex: 0.2,
                hasHighScoring: false,
                dramaScore: 88,
                paceIndex: 0.4,
                ballMovementIndex: 0.6,
                shotProfileIndex: 0.8,
                defenseIndex: 0.7,
                broadcastHypeIndex: 0.8,
                studioBuzzIndex: 0.7,
                rivalryIndex: 0.5,
                starDuelIndex: 0.8
            },
            watchLinks: {
                webFallback: `https://www.nba.com/game/102`
            }
        },
        {
            id: `nba_${dateStr.replace(/-/g, '')}_SAS_ATL`,
            sourceId: 103,
            startTime: `${dateStr}T19:00:00Z`,
            homeTeam: resolveTeam({ id: 1, abbreviation: 'ATL', city: 'Atlanta', conference: 'East', division: 'Southeast', full_name: 'Atlanta Hawks', name: 'Hawks' }),
            awayTeam: resolveTeam({ id: 27, abbreviation: 'SA', city: 'San Antonio', conference: 'West', division: 'Southwest', full_name: 'San Antonio Spurs', name: 'Spurs' }),
            homeScore: 125,
            awayScore: 98,
            status: 'Final',
            period: 4,
            signals: {
                clutchIndex: 0.1,
                leadChangeIndex: 0.2,
                swingIndex: 0.1,
                comebackIndex: 0.1,
                teamQualityIndex: 0.4,
                matchupQuality: 0.35,
                isOT: false,
                isCloseGame: false,
                isBlowout: true,
                blowoutIndex: 0.9,
                hasHighScoring: true,
                dramaScore: 20,
                paceIndex: 0.8,
                ballMovementIndex: 0.4,
                shotProfileIndex: 0.4,
                defenseIndex: 0.2,
                broadcastHypeIndex: 0.3,
                studioBuzzIndex: 0.4,
                rivalryIndex: 0,
                starDuelIndex: 0.3
            },
            watchLinks: {
                webFallback: `https://www.nba.com/game/103`
            }
        }
    ];
}
