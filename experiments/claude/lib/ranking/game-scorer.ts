/**
 * Game Scorer - Heart of the Ranking Algorithm
 *
 * Philosophy: Objective quality signals come first, personalization is a tiebreaker.
 *
 * Scoring Components:
 * 1. Drama Score (0-40 pts): Margin, lead changes, clutch moments
 * 2. Star Performance Score (0-30 pts): Notable individual performances
 * 3. Storyline Score (0-20 pts): Rivalry, revenge, milestone watch
 * 4. Pace & Style Score (0-10 pts): Tempo, ball movement, physicality
 * 5. Personalization Boost (-15 to +50 pts): Team/player preferences applied LAST
 *
 * Total possible: 0-150 points (higher = more watchable)
 */

import type { Game, GameDetails, InternalGameStats } from '../data-providers/types';
import type { UserProfile } from '../schemas/profile';

export interface GameScore {
  gameId: string;
  totalScore: number;
  breakdown: {
    dramaScore: number;
    starPerformanceScore: number;
    storylineScore: number;
    paceStyleScore: number;
    personalizationBoost: number;
  };
  viewingSuggestion: 'condensed' | 'fourth-quarter' | 'full-game';
  tags: string[]; // Spoiler-free tags explaining the score
}

/**
 * Scores a single game based on objective quality + personalization
 *
 * @param game - Game with internal stats (scores not exposed to UI)
 * @param gameDetails - Additional game context (teams, players)
 * @param profile - User profile for personalization (optional)
 * @returns GameScore with total and breakdown
 */
export function scoreGame(
  game: Game,
  gameDetails: GameDetails,
  profile?: UserProfile
): GameScore {
  const { internalStats } = game;

  // Component 1: Drama Score (0-40 points)
  const dramaScore = calculateDramaScore(internalStats);

  // Component 2: Star Performance Score (0-30 points)
  const starPerformanceScore = calculateStarPerformanceScore(gameDetails);

  // Component 3: Storyline Score (0-20 points)
  const storylineScore = calculateStorylineScore(gameDetails);

  // Component 4: Pace & Style Score (0-10 points)
  const paceStyleScore = calculatePaceStyleScore(internalStats, profile);

  // Component 5: Personalization Boost (-15 to +50 points)
  const personalizationBoost = profile
    ? calculatePersonalizationBoost(gameDetails, profile)
    : 0;

  // Total score
  const totalScore =
    dramaScore +
    starPerformanceScore +
    storylineScore +
    paceStyleScore +
    personalizationBoost;

  // Generate spoiler-free tags
  const tags = generateTags(
    game,
    gameDetails,
    { dramaScore, starPerformanceScore, storylineScore, paceStyleScore }
  );

  // Determine viewing suggestion
  const viewingSuggestion = determineViewingSuggestion(totalScore, dramaScore);

  return {
    gameId: game.id,
    totalScore: Math.max(0, totalScore), // Floor at 0
    breakdown: {
      dramaScore,
      starPerformanceScore,
      storylineScore,
      paceStyleScore,
      personalizationBoost,
    },
    viewingSuggestion,
    tags,
  };
}

/**
 * Drama Score: 0-40 points
 *
 * Based on:
 * - Final margin (closer = higher score)
 * - Lead changes (more = higher score)
 * - Competitive quarters (how many quarters were close)
 */
function calculateDramaScore(stats: InternalGameStats): number {
  let score = 0;

  // Final margin scoring (0-20 points)
  if (stats.finalMargin !== undefined) {
    if (stats.finalMargin <= 3) {
      score += 20; // One possession game
    } else if (stats.finalMargin <= 7) {
      score += 15; // Two possession game
    } else if (stats.finalMargin <= 12) {
      score += 10; // Three-four possession game
    } else if (stats.finalMargin <= 20) {
      score += 5; // Competitive but not close
    }
    // Blowouts (>20) get 0 drama points
  }

  // Lead changes scoring (0-15 points)
  if (stats.leadChanges !== undefined) {
    if (stats.leadChanges >= 15) {
      score += 15; // Back and forth thriller
    } else if (stats.leadChanges >= 10) {
      score += 12;
    } else if (stats.leadChanges >= 5) {
      score += 8;
    } else if (stats.leadChanges >= 2) {
      score += 4;
    }
  }

  // Ties scoring (0-5 points)
  if (stats.tiesCount !== undefined) {
    if (stats.tiesCount >= 10) {
      score += 5; // Extremely tight
    } else if (stats.tiesCount >= 5) {
      score += 3;
    } else if (stats.tiesCount >= 2) {
      score += 1;
    }
  }

  return Math.min(score, 40); // Cap at 40
}

/**
 * Star Performance Score: 0-30 points
 *
 * Based on notable individual performances (without revealing exact numbers)
 * This is where we'd check for:
 * - 40+ point performances
 * - Triple-doubles
 * - Career highs
 * - Milestone achievements
 *
 * NOTE: In full implementation, this would query player stats from game details
 */
function calculateStarPerformanceScore(gameDetails: GameDetails): number {
  let score = 0;

  // TODO: Implement when we have player stats in GameDetails
  // For now, return base score
  // In full implementation:
  // - Check for 40+ point games (+15)
  // - Check for triple-doubles (+12)
  // - Check for career highs (+10)
  // - Check for milestone watch (30k points, etc.) (+8)

  return Math.min(score, 30);
}

/**
 * Storyline Score: 0-20 points
 *
 * Based on contextual storylines:
 * - Rivalry games
 * - Revenge games (player vs former team)
 * - Playoff implications
 * - Conference finals rematch
 * - Division matchups
 *
 * NOTE: In full implementation, this would check game metadata
 */
function calculateStorylineScore(gameDetails: GameDetails): number {
  let score = 0;

  // TODO: Implement when we have storyline metadata
  // For now, check basic rivalry (same division)
  if (gameDetails.awayTeam.division === gameDetails.homeTeam.division) {
    score += 8; // Division rivalry
  }

  // Check conference matchup
  if (gameDetails.awayTeam.conference === gameDetails.homeTeam.conference) {
    score += 3; // Conference game (slightly more important)
  }

  return Math.min(score, 20);
}

/**
 * Pace & Style Score: 0-10 points
 *
 * Matches user's style preferences
 * - High pace games for users who prefer fast tempo
 * - High scoring for users who prefer offense
 * - Physical games for users who prefer chippy play
 *
 * NOTE: This is a tiebreaker - small point value
 */
function calculatePaceStyleScore(
  stats: InternalGameStats,
  profile?: UserProfile
): number {
  if (!profile?.stylePreferences) return 5; // Neutral score if no preferences

  let score = 5; // Base score

  // TODO: Implement when we have pace/style stats in InternalGameStats
  // For now, use total points as a proxy for pace
  if (stats.totalPoints !== undefined) {
    // 1-5 scale: 1-2 = prefer defense, 3 = neutral, 4-5 = prefer offense
    const userPrefersHighScoring = profile.stylePreferences.offenseDefenseBalance >= 4;
    const userPrefersLowScoring = profile.stylePreferences.offenseDefenseBalance <= 2;

    if (stats.totalPoints > 230 && userPrefersHighScoring) {
      score += 5; // High scoring game, user loves it
    } else if (stats.totalPoints < 200 && userPrefersLowScoring) {
      score += 5; // Defensive battle, user loves it
    }
  }

  return Math.min(score, 10);
}

/**
 * Personalization Boost: -15 to +50 points
 *
 * Applied LAST as tiebreaker
 * - Favorite team games: +5 to +15
 * - Must-see player involvement: +15
 * - Hooper player involvement: +8
 * - Villain player involvement: -15
 * - GOAT player involvement: +20
 *
 * Rules:
 * - Favorite player boost only if storyline exists OR notable performance
 * - Villain penalty applies even if game is objectively good
 */
function calculatePersonalizationBoost(
  gameDetails: GameDetails,
  profile: UserProfile
): number {
  let boost = 0;

  // Check team rankings
  if (profile.teamRankings && profile.teamRankings.length > 0) {
    const awayTeamRanking = profile.teamRankings.find(
      t => t.teamId === gameDetails.awayTeamId
    );
    const homeTeamRanking = profile.teamRankings.find(
      t => t.teamId === gameDetails.homeTeamId
    );

    // Use the highest ranked team (lowest rank number)
    const bestRank = Math.min(
      awayTeamRanking?.rank ?? 31,
      homeTeamRanking?.rank ?? 31
    );

    if (bestRank <= 30) {
      // Convert rank to boost: Rank 1 = +15, Rank 30 = +0
      // Formula: 15 - ((rank - 1) * 0.5)
      // Rank 1: 15 - 0 = 15
      // Rank 2: 15 - 0.5 = 14.5
      // Rank 5: 15 - 2 = 13
      // Rank 10: 15 - 4.5 = 10.5
      // Rank 20: 15 - 9.5 = 5.5
      // Rank 30: 15 - 14.5 = 0.5
      const teamBoost = Math.max(0, 15 - ((bestRank - 1) * 0.5));
      boost += teamBoost;
    }
  }
  // Fallback to legacy favoriteTeam field
  else if (profile.favoriteTeam) {
    const favoriteTeamPlaying =
      gameDetails.awayTeamId === profile.favoriteTeam ||
      gameDetails.homeTeamId === profile.favoriteTeam;

    if (favoriteTeamPlaying) {
      boost += profile.weights.favoriteTeamBoost;
    }
  }

  // Check for player bucket involvement
  // NOTE: In full implementation, we'd check if players from buckets
  // are in the game's participant list and had notable performances

  // TODO: Implement when we have player participation and performance data
  // const mustSeePlayers = profile.players.filter(p => p.bucket === 'must-see');
  // const villainPlayers = profile.players.filter(p => p.bucket === 'villain');
  // etc.

  return boost;
}

/**
 * Generates spoiler-free tags explaining the score
 *
 * Tags come from approved whitelist (see spoiler-safety/validator.ts)
 */
function generateTags(
  game: Game,
  gameDetails: GameDetails,
  scores: {
    dramaScore: number;
    starPerformanceScore: number;
    storylineScore: number;
    paceStyleScore: number;
  }
): string[] {
  const tags: string[] = [];

  // Drama tags
  if (scores.dramaScore >= 30) {
    tags.push('tight finish');
  } else if (scores.dramaScore >= 20) {
    tags.push('late drama');
  }

  // Storyline tags
  if (gameDetails.awayTeam.division === gameDetails.homeTeam.division) {
    tags.push('rivalry game');
  }

  // Star performance tags
  if (scores.starPerformanceScore >= 20) {
    tags.push('star power');
  }

  // Style tags
  if (game.internalStats.totalPoints && game.internalStats.totalPoints > 230) {
    tags.push('high pace');
  } else if (
    game.internalStats.totalPoints &&
    game.internalStats.totalPoints < 200
  ) {
    tags.push('defensive battle expected');
  }

  return tags;
}

/**
 * Determines viewing suggestion based on total score and drama
 *
 * Logic:
 * - 90+: Full game recommended
 * - 60-89: Watch 4th quarter full, then decide
 * - <60: Condensed is enough
 *
 * Exception: If drama score is very high (35+), always recommend at least 4th quarter
 */
function determineViewingSuggestion(
  totalScore: number,
  dramaScore: number
): 'condensed' | 'fourth-quarter' | 'full-game' {
  // High drama games always worth at least 4th quarter
  if (dramaScore >= 35) {
    if (totalScore >= 90) return 'full-game';
    return 'fourth-quarter';
  }

  // Standard thresholds
  if (totalScore >= 90) return 'full-game';
  if (totalScore >= 60) return 'fourth-quarter';
  return 'condensed';
}

/**
 * Scores multiple games and returns sorted by total score (descending)
 */
export function scoreAndRankGames(
  games: Game[],
  gameDetailsMap: Map<string, GameDetails>,
  profile?: UserProfile
): GameScore[] {
  const scores = games.map((game) => {
    const details = gameDetailsMap.get(game.id);
    if (!details) {
      throw new Error(`GameDetails not found for game ${game.id}`);
    }
    return scoreGame(game, details, profile);
  });

  // Sort by total score descending
  return scores.sort((a, b) => b.totalScore - a.totalScore);
}
