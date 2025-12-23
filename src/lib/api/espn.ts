
import { Game, GameStatusSchema, Team } from '@/types/schema';
import { ALL_TEAMS, TEAM_STANDINGS_2024 } from '@/lib/data/allTeams';

/**
 * ESPN API Response Types (Simplified)
 */
interface ESPNScoreboardResponse {
    events: ESPNEvent[];
}

interface ESPNEvent {
    id: string;
    date: string;
    status: {
        period: number;
        type: {
            state: 'pre' | 'in' | 'post';
            completed: boolean;
            detail: string;
        };
    };
    competitions: Array<{
        competitors: Array<{
            homeAway: 'home' | 'away';
            score: string;
            team: {
                id: string;
                abbreviation: string;
                location: string;
                name: string;
            };
            linescores?: Array<{ value: number }>;
            leaders?: Array<{
                name: string;
                leaders: Array<{
                    displayValue: string;
                    athlete: {
                        fullName: string;
                    };
                }>;
            }>;
        }>;
        leaders?: Array<{
            name: string;
            leaders: Array<{
                displayValue: string;
                athlete: {
                    fullName: string;
                };
            }>;
        }>;
    }>;
}

/**
 * Fetch NBA Scoreboard from ESPN for a specific date
 */
export async function fetchESPNGames(date: Date): Promise<Game[]> {
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    // Use our local API proxy to bypass CORS
    const url = `/api/games?dates=${dateStr}`;

    console.log(`[ESPN] Fetching scoreboard via proxy for date: ${dateStr}`);

    try {
        const [espnRes, nbaRes] = await Promise.all([
            fetch(url, { cache: 'no-store' }),
            fetch(`${url}&source=nba`, { cache: 'no-store' })
        ]);

        if (!espnRes.ok) throw new Error(`ESPN API error: ${espnRes.statusText}`);

        const espnData: ESPNScoreboardResponse = await espnRes.json();
        const nbaData = nbaRes.ok ? await nbaRes.json() : null;

        const games = (espnData.events || []).map(event => mapESPNEventToGame(event, dateStr));

        // Enrich with NBA.com IDs if available
        if (nbaData?.scoreboard?.games) {
            games.forEach(game => {
                const nbaGame = nbaData.scoreboard.games.find((g: any) => {
                    const homeMatch = g.homeTeam.teamTricode === game.homeTeam.abbreviation ||
                        g.homeTeam.teamName === game.homeTeam.name;
                    const awayMatch = g.awayTeam.teamTricode === game.awayTeam.abbreviation ||
                        g.awayTeam.teamName === game.awayTeam.name;
                    return homeMatch && awayMatch;
                });
                if (nbaGame) {
                    game.nbaId = nbaGame.gameId;
                    // Update watch link to primary NBA.com version
                    const nbaWatchUrl = `https://www.nba.com/game/${nbaGame.awayTeam.teamTricode.toLowerCase()}-vs-${nbaGame.homeTeam.teamTricode.toLowerCase()}-${nbaGame.gameId}?watchFullGame`;
                    game.watchLinks = {
                        webFallback: nbaWatchUrl,
                        primary: nbaWatchUrl,
                        espn: `https://www.espn.com/nba/game/_/gameId/${game.sourceId}`
                    };
                }
            });
        }

        return games;
    } catch (e) {
        console.error('[ESPN] Fetch failed:', e);
        return [];
    }
}

/**
 * Map ESPN Event to Canonical Game Schema
 */
function mapESPNEventToGame(event: ESPNEvent, dateStr: string): Game {
    const comp = event.competitions[0];
    const home = comp.competitors.find(c => c.homeAway === 'home')!;
    const away = comp.competitors.find(c => c.homeAway === 'away')!;

    // 1. Resolve Teams
    const homeTeam = resolveTeam(home.team.abbreviation, home.team.id);
    const awayTeam = resolveTeam(away.team.abbreviation, away.team.id);

    // 2. Resolve Status
    let status: 'Scheduled' | 'Live' | 'Final' | 'Postponed' = 'Scheduled';
    if (event.status.type.completed || event.status.type.state === 'post') {
        status = 'Final';
    } else if (event.status.type.state === 'in') {
        status = 'Live';
    }

    // 3. ID Generation (Consistent with project requirements)
    const compositeId = `nba_${dateStr}_${awayTeam.abbreviation}_${homeTeam.abbreviation}`;

    // 4. Calculate Signals (Drama, Comeback, etc.)
    const signals = calculateSignals(comp, status === 'Final', event.status.period);

    return {
        id: compositeId,
        sourceId: parseInt(event.id),
        startTime: event.date,
        homeTeam,
        awayTeam,
        homeScore: parseInt(home.score) || 0,
        awayScore: parseInt(away.score) || 0,
        status,
        period: event.status.period || 4,
        signals,
        watchLinks: {
            webFallback: `https://www.espn.com/nba/game/_/gameId/${event.id}`,
            espn: `https://www.espn.com/nba/game/_/gameId/${event.id}`
        }
    };
}

/**
 * Bridge ESPN team data to our ALL_TEAMS data
 */
function resolveTeam(abbreviation: string, espnId: string): Team {
    // 1. Handle Known Mismatches
    const abbrevMap: Record<string, string> = {
        'NY': 'NYK',
        'SA': 'SAS',
        'GS': 'GSW',
        'UT': 'UTA',
        'UTAH': 'UTA',
        'NO': 'NOP',
        'WSH': 'WAS'
    };

    const targetAbbrev = abbrevMap[abbreviation] || abbreviation;

    // 2. Find in our local data
    const found = ALL_TEAMS.find(t =>
        t.abbreviation === targetAbbrev ||
        t.name.toLowerCase() === targetAbbrev.toLowerCase() ||
        t.full_name.toLowerCase() === targetAbbrev.toLowerCase()
    );

    if (found) return found;

    // Fallback/Unknown
    return {
        id: parseInt(espnId),
        abbreviation,
        city: '',
        conference: 'East',
        division: '',
        full_name: abbreviation,
        name: abbreviation
    };
}

/**
 * Extract ranking signals from ESPN data using the refined ChatGPT-inspired model
 */
function calculateSignals(comp: ESPNEvent['competitions'][0], isFinal: boolean, period: number) {
    const home = comp.competitors.find(c => c.homeAway === 'home')!;
    const away = comp.competitors.find(c => c.homeAway === 'away')!;

    const hScore = parseInt(home.score) || 0;
    const aScore = parseInt(away.score) || 0;
    const margin = Math.abs(hScore - aScore);

    // 1. Team Quality Index (0-1) based on 2024 standings
    const hWins = (TEAM_STANDINGS_2024 as any)[home.team.id] || 30;
    const aWins = (TEAM_STANDINGS_2024 as any)[away.team.id] || 30;
    // Normalize: (Wins / 68) * 0.5 for each team. Max wins = 68.
    const teamQualityIndex = Math.min(1, (hWins + aWins) / 120);

    const signals = {
        clutchIndex: 0,
        leadChangeIndex: 0,
        swingIndex: 0,
        comebackIndex: 0,
        teamQualityIndex,
        matchupQuality: teamQualityIndex * 0.9, // Pre-game hype proxy
        isOT: period > 4,
        isCloseGame: margin <= 5 && isFinal,
        isBlowout: margin >= 20 && isFinal,
        blowoutIndex: Math.min(1, margin / 25),
        hasHighScoring: (hScore + aScore) > 230,
        dramaScore: 0,
        paceIndex: 0.5,
        ballMovementIndex: 0.5,
        shotProfileIndex: 0.5,
        defenseIndex: 0.5,
        broadcastHypeIndex: 0.5,
        studioBuzzIndex: 0.5,
        rivalryIndex: 0,
        starDuelIndex: 0,
        topPerformers: [] as string[]
    };

    // Extract top performers
    if (comp.leaders) {
        const scorers = comp.leaders.find(l => l.name === 'points' || l.name === 'scoring');
        if (scorers) {
            signals.topPerformers = scorers.leaders.map(l => l.athlete.fullName);
        }
    }

    // Calculate Drama Indices from linescores
    if (home.linescores && away.linescores) {
        let hTotal = 0;
        let aTotal = 0;
        let maxDeficit = 0;
        let leadChanges = 0;
        let ties = 0;
        let prevLeader: 'home' | 'away' | 'tied' = 'tied';

        // home.linescores.length might be 4, 5+ for OT
        let lastPeriodMargin = 0;

        home.linescores.forEach((q, i) => {
            hTotal += q.value;
            aTotal += (away.linescores![i]?.value || 0);

            const currentLeader = hTotal > aTotal ? 'home' : (aTotal > hTotal ? 'away' : 'tied');

            if (currentLeader === 'tied') ties++;
            if (currentLeader !== prevLeader && currentLeader !== 'tied' && prevLeader !== 'tied') {
                leadChanges++;
            }
            prevLeader = currentLeader;

            // Track comeback
            const currentMargin = hTotal - aTotal;
            if (currentMargin > 0) {
                // Home leading, track if they were down
                maxDeficit = Math.max(maxDeficit, Math.abs(Math.min(0, currentMargin - q.value)));
            } else {
                // Away leading, track if they were down
                maxDeficit = Math.max(maxDeficit, Math.abs(Math.max(0, currentMargin + (away.linescores![i]?.value || 0))));
            }

            // Capture clutch context (4th period or OT)
            if (i >= 3) {
                lastPeriodMargin = Math.abs(hTotal - aTotal);
            }
        });

        // Normalize Indices (0-1)
        signals.leadChangeIndex = Math.min(1, (leadChanges + (ties * 0.5)) / 15);
        signals.comebackIndex = Math.min(1, maxDeficit / 20);

        // Clutch Index: How close was it late?
        if (isFinal) {
            const finalClutch = Math.max(0, 1 - (margin / 15));
            const fourthClutch = Math.max(0, 1 - (lastPeriodMargin / 15));
            signals.clutchIndex = (finalClutch * 0.7) + (fourthClutch * 0.3);
        }

        // Swing Index: Proxy based on lead changes and comebacks
        signals.swingIndex = Math.min(1, (signals.leadChangeIndex * 0.6) + (signals.comebackIndex * 0.4));

        // Legacy Drama Score
        let drama = 0;
        drama += signals.clutchIndex * 40;
        drama += signals.leadChangeIndex * 30;
        drama += signals.comebackIndex * 20;
        if (signals.isOT) drama += 10;
        signals.dramaScore = Math.min(100, Math.round(drama));
    }

    return signals;
}
