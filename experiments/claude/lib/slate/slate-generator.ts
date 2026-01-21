/**
 * Slate Generator - Main Orchestrator
 *
 * Connects all systems to generate the daily ranked game list:
 * 1. Fetches games in slate window
 * 2. Scores and ranks games
 * 3. Generates discovery section
 * 4. Creates spoiler-free output
 *
 * This is the core user flow.
 */

import type { DataProvider, Game, GameDetails } from '../data-providers/types';
import type { UserProfile } from '../schemas/profile';
import { scoreAndRankGames, type GameScore } from '../ranking/game-scorer';
import { validateSpoilerFree } from '../spoiler-safety/validator';

/**
 * Slate window configuration
 * Default: 07:30 local time rolling cutoff
 */
export interface SlateWindow {
  start: Date;
  end: Date;
  timezone: string; // IANA timezone string (e.g., "America/Los_Angeles")
}

/**
 * Ranked game output (UI-facing)
 * CRITICAL: No scores, winners, or spoiler data
 */
export interface RankedGame {
  gameId: string;
  awayTeam: {
    id: string;
    name: string;
    city: string;
  };
  homeTeam: {
    id: string;
    name: string;
    city: string;
  };
  startTime: string; // ISO 8601 format
  watchabilityScore: number; // 0-150
  viewingSuggestion: 'condensed' | 'fourth-quarter' | 'full-game';
  tags: string[]; // Spoiler-free tags
  watchLinks: {
    nbaApp: string; // Deep link to NBA app
    web: string; // Link to NBA.com
  };
}

/**
 * Discovery game (for learning rising talent)
 * Generic tags only, no player names
 */
export interface DiscoveryGame {
  gameId: string;
  awayTeam: string; // Team name
  homeTeam: string;
  startTime: string;
  genericTags: string[]; // "emerging talent showcase", "young core matchup", etc.
  watchLinks: {
    nbaApp: string;
    web: string;
  };
}

/**
 * Complete slate output
 * Matches canonical JSON schema from PRD Section 18
 */
export interface SlateOutput {
  meta: {
    generatedAt: string; // ISO 8601
    timezone: string;
    slateWindow: {
      start: string; // ISO 8601
      end: string; // ISO 8601
    };
    spoilerPolicy: {
      noScores: true;
      noWinners: true;
      noOvertimeMentions: true;
    };
  };
  rankedGames: RankedGame[];
  discovery: DiscoveryGame[];
  shareSnapshot: {
    headline: string; // Spoiler-free summary
    shareUrl?: string; // Generated in Phase 2
  };
}

/**
 * Generates the complete slate output
 *
 * @param provider - Data provider (e.g., balldontlie.io client)
 * @param window - Slate time window
 * @param profile - User profile for personalization (optional)
 * @returns SlateOutput with ranked games and discovery
 */
export async function generateSlate(
  provider: DataProvider,
  window: SlateWindow,
  profile?: UserProfile
): Promise<SlateOutput> {
  // Step 1: Fetch games in window
  const games = await provider.getGamesInWindow(window.start, window.end);

  console.log('[SlateGenerator] Fetched games:', {
    total: games.length,
    statuses: games.map(g => ({ id: g.id, status: g.status, startTime: g.startTime })),
  });

  // Filter to only finished games
  const finishedGames = games.filter((g) => g.status === 'final');

  console.log('[SlateGenerator] Finished games:', {
    count: finishedGames.length,
    gameIds: finishedGames.map(g => g.id),
  });

  if (finishedGames.length === 0) {
    return createEmptySlate(window);
  }

  // Step 2: Fetch detailed data for each game
  // Add delay between requests to avoid rate limiting (free tier: 60 req/min = 1 req/sec)
  const gameDetailsMap = new Map<string, GameDetails>();
  for (const game of finishedGames) {
    try {
      const details = await provider.getGameDetails(game.id);
      gameDetailsMap.set(game.id, details);

      // Wait 1 second between requests to stay under rate limit
      if (finishedGames.indexOf(game) < finishedGames.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`Failed to fetch details for game ${game.id}:`, error);
      // Skip this game if we can't get details
    }
  }

  // Step 3: Score and rank games (only for games we have details for)
  const gamesWithDetails = finishedGames.filter(game => gameDetailsMap.has(game.id));
  const rankedScores = scoreAndRankGames(gamesWithDetails, gameDetailsMap, profile);

  // Step 4: Convert to UI-facing format
  const rankedGames = rankedScores.map((score) =>
    convertToRankedGame(score, gameDetailsMap.get(score.gameId)!)
  );

  // Step 5: Generate discovery section
  const discovery = generateDiscoverySection(rankedGames, gameDetailsMap);

  // Step 6: Generate spoiler-free headline
  const headline = generateHeadline(rankedGames, window);

  // Step 7: Validate all output is spoiler-free
  validateSlateOutput({ rankedGames, discovery, headline });

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      timezone: window.timezone,
      slateWindow: {
        start: window.start.toISOString(),
        end: window.end.toISOString(),
      },
      spoilerPolicy: {
        noScores: true,
        noWinners: true,
        noOvertimeMentions: true,
      },
    },
    rankedGames,
    discovery,
    shareSnapshot: {
      headline,
      shareUrl: undefined, // Generated in Phase 2 with KV store
    },
  };
}

/**
 * Converts scored game to UI-facing ranked game format
 */
function convertToRankedGame(
  score: GameScore,
  gameDetails: GameDetails
): RankedGame {
  return {
    gameId: score.gameId,
    awayTeam: {
      id: gameDetails.awayTeam.id,
      name: gameDetails.awayTeam.name,
      city: gameDetails.awayTeam.city,
    },
    homeTeam: {
      id: gameDetails.homeTeam.id,
      name: gameDetails.homeTeam.name,
      city: gameDetails.homeTeam.city,
    },
    startTime: gameDetails.startTime.toISOString(),
    watchabilityScore: score.totalScore,
    viewingSuggestion: score.viewingSuggestion,
    tags: score.tags,
    watchLinks: generateWatchLinks(score.gameId, gameDetails),
  };
}

/**
 * Generates deep links to NBA app and web
 *
 * NOTE: These are placeholder URLs - actual deep link format
 * needs to be tested with NBA app
 */
function generateWatchLinks(
  gameId: string,
  gameDetails: GameDetails
): { nbaApp: string; web: string } {
  // Format: nba://game/{gameId}
  const nbaApp = `nba://game/${gameId}`;

  // Format: https://www.nba.com/game/{awayAbbrev}-vs-{homeAbbrev}-{gameId}
  const web = `https://www.nba.com/game/${gameDetails.awayTeam.abbreviation.toLowerCase()}-vs-${gameDetails.homeTeam.abbreviation.toLowerCase()}-${gameId}`;

  return { nbaApp, web };
}

/**
 * Generates discovery section (1-2 games good for learning rising talent)
 *
 * Logic:
 * - Pick games with young rosters (TODO: need roster age data)
 * - Exclude top-ranked games (already in main list)
 * - Use generic tags only, no player names
 */
function generateDiscoverySection(
  rankedGames: RankedGame[],
  gameDetailsMap: Map<string, GameDetails>
): DiscoveryGame[] {
  // For MVP, return empty - implement in V1 when we have player age data
  // In full implementation:
  // 1. Filter to games with multiple young players (age < 25)
  // 2. Exclude top 5 ranked games
  // 3. Pick 1-2 games
  // 4. Generate generic tags: "emerging talent showcase", "young core matchup"

  return [];
}

/**
 * Generates spoiler-free headline for sharing
 *
 * Format: "[Date] NBA Slate: [X] games - [brief characterization]"
 * Example: "Dec 20 NBA Slate: 11 games - multiple tight finishes"
 */
function generateHeadline(
  rankedGames: RankedGame[],
  window: SlateWindow
): string {
  const date = window.start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: window.timezone,
  });

  const gameCount = rankedGames.length;

  // Characterize the slate
  let characterization = '';
  if (gameCount === 0) {
    characterization = 'no games';
  } else if (gameCount === 1) {
    characterization = '1 game';
  } else {
    // Count games with tight finishes (drama score indicator)
    const tightGames = rankedGames.filter((g) =>
      g.tags.includes('tight finish')
    ).length;

    if (tightGames >= 3) {
      characterization = `${gameCount} games - multiple tight finishes`;
    } else if (tightGames >= 1) {
      characterization = `${gameCount} games - some close action`;
    } else {
      characterization = `${gameCount} games`;
    }
  }

  return `${date} NBA Slate: ${characterization}`;
}

/**
 * Validates entire slate output is spoiler-free
 * Throws error if any violations found
 */
function validateSlateOutput(output: {
  rankedGames: RankedGame[];
  discovery: DiscoveryGame[];
  headline: string;
}): void {
  // Validate headline
  const headlineCheck = validateSpoilerFree(output.headline, 'headline');
  if (!headlineCheck.valid) {
    throw new Error(`Spoiler violation in headline: ${headlineCheck.reason}`);
  }

  // Validate all ranked game tags
  for (const game of output.rankedGames) {
    for (const tag of game.tags) {
      const tagCheck = validateSpoilerFree(tag, `game ${game.gameId} tag`);
      if (!tagCheck.valid) {
        throw new Error(
          `Spoiler violation in game ${game.gameId} tag "${tag}": ${tagCheck.reason}`
        );
      }
    }
  }

  // Validate all discovery tags
  for (const game of output.discovery) {
    for (const tag of game.genericTags) {
      const tagCheck = validateSpoilerFree(tag, `discovery game ${game.gameId} tag`);
      if (!tagCheck.valid) {
        throw new Error(
          `Spoiler violation in discovery game ${game.gameId} tag "${tag}": ${tagCheck.reason}`
        );
      }
    }
  }
}

/**
 * Creates empty slate when no games found
 */
function createEmptySlate(window: SlateWindow): SlateOutput {
  return {
    meta: {
      generatedAt: new Date().toISOString(),
      timezone: window.timezone,
      slateWindow: {
        start: window.start.toISOString(),
        end: window.end.toISOString(),
      },
      spoilerPolicy: {
        noScores: true,
        noWinners: true,
        noOvertimeMentions: true,
      },
    },
    rankedGames: [],
    discovery: [],
    shareSnapshot: {
      headline: `${window.start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: window.timezone })} NBA Slate: no games`,
    },
  };
}

/**
 * Helper: Creates slate window for "previous slate" (default 07:30 cutoff)
 *
 * From PRD: "Previous slate = all NBA games that became Final between
 * the last cutoff and the current cutoff, in the user's timezone."
 *
 * @param timezone - IANA timezone string
 * @param cutoffHour - Hour of day for cutoff (default 7 = 07:00)
 * @param cutoffMinute - Minute of hour for cutoff (default 30)
 * @returns SlateWindow from last cutoff to current cutoff (or now if before cutoff)
 */
export function createPreviousSlateWindow(
  timezone: string,
  cutoffHour: number = 7,
  cutoffMinute: number = 30
): SlateWindow {
  const now = new Date();

  // Create cutoff time for today in the specified timezone
  const todayCutoff = new Date(
    now.toLocaleString('en-US', { timeZone: timezone })
  );
  todayCutoff.setHours(cutoffHour, cutoffMinute, 0, 0);

  // Determine the last cutoff and next cutoff
  let lastCutoff: Date;
  let nextCutoff: Date;

  if (now < todayCutoff) {
    // Before today's cutoff: last cutoff was yesterday, next is today
    lastCutoff = new Date(todayCutoff.getTime() - 24 * 60 * 60 * 1000);
    nextCutoff = todayCutoff;
  } else {
    // After today's cutoff: last cutoff was today, next is tomorrow
    lastCutoff = todayCutoff;
    nextCutoff = new Date(todayCutoff.getTime() + 24 * 60 * 60 * 1000);
  }

  // Slate window is from last cutoff to next cutoff (or now if we haven't reached next cutoff)
  return {
    start: lastCutoff,
    end: now < nextCutoff ? now : nextCutoff,
    timezone,
  };
}
