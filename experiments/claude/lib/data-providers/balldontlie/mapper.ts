/**
 * BallDontLie to Canonical Schema Mapper
 *
 * Converts external BallDontLie API responses to our internal canonical schema.
 * This abstraction allows us to swap data providers without changing core logic.
 */

import type {
  Team,
  Player,
  Game,
  GameDetails,
  InternalGameStats,
  QuarterScore,
  PlayerStat,
  StatCategory,
} from '../types';
import type { BDLTeam, BDLPlayer, BDLGame, BDLStats } from './client';

/**
 * Maps BDL Team to canonical Team
 */
export function mapTeam(bdlTeam: BDLTeam): Team {
  return {
    id: bdlTeam.id.toString(),
    name: bdlTeam.name,
    abbreviation: bdlTeam.abbreviation,
    city: bdlTeam.city,
    conference: bdlTeam.conference as 'East' | 'West',
    division: bdlTeam.division,
    fullName: bdlTeam.full_name,
  };
}

/**
 * Maps BDL Player to canonical Player
 */
export function mapPlayer(bdlPlayer: BDLPlayer): Player {
  return {
    id: bdlPlayer.id.toString(),
    firstName: bdlPlayer.first_name,
    lastName: bdlPlayer.last_name,
    fullName: `${bdlPlayer.first_name} ${bdlPlayer.last_name}`,
    teamId: bdlPlayer.team.id.toString(),
    position: bdlPlayer.position || undefined,
    jerseyNumber: bdlPlayer.jersey_number || undefined,
  };
}

/**
 * Maps BDL Game to canonical Game
 *
 * CRITICAL: Internal stats (scores, margin) are populated but NEVER exposed to UI
 */
export function mapGame(bdlGame: BDLGame, stats?: BDLStats[]): Game {
  // Determine game status
  let status: 'scheduled' | 'in_progress' | 'final';
  if (bdlGame.status === 'Final') {
    status = 'final';
  } else if (bdlGame.status === 'In Progress') {
    status = 'in_progress';
  } else {
    status = 'scheduled';
  }

  // Calculate internal stats (for algorithm use only)
  const internalStats = calculateInternalStats(bdlGame, stats);

  return {
    id: bdlGame.id.toString(),
    startTime: new Date(bdlGame.date),
    finalTime: status === 'final' ? new Date(bdlGame.date) : null,
    awayTeamId: bdlGame.visitor_team.id.toString(),
    homeTeamId: bdlGame.home_team.id.toString(),
    status,
    internalStats,
  };
}

/**
 * Maps BDL Game + stats to canonical GameDetails
 */
export function mapGameDetails(
  bdlGame: BDLGame,
  stats: BDLStats[]
): GameDetails {
  const game = mapGame(bdlGame, stats);

  // Extract unique players from stats
  const playerMap = new Map<string, Player>();
  stats.forEach((stat) => {
    const playerId = stat.player.id.toString();
    if (!playerMap.has(playerId)) {
      playerMap.set(playerId, mapPlayer(stat.player));
    }
  });

  return {
    ...game,
    awayTeam: mapTeam(bdlGame.visitor_team),
    homeTeam: mapTeam(bdlGame.home_team),
    participants: Array.from(playerMap.values()),
  };
}

/**
 * Calculates internal game stats from BDL data
 *
 * These stats are used for ranking but NEVER displayed to users
 */
function calculateInternalStats(
  bdlGame: BDLGame,
  stats?: BDLStats[]
): InternalGameStats {
  const internalStats: InternalGameStats = {
    quarterScores: [],
  };

  // Only calculate for finished games
  if (bdlGame.status !== 'Final') {
    return internalStats;
  }

  // Final margin
  const homeScore = bdlGame.home_team_score;
  const visitorScore = bdlGame.visitor_team_score;
  internalStats.finalMargin = Math.abs(homeScore - visitorScore);

  // Total points
  internalStats.totalPoints = homeScore + visitorScore;

  // Note: BallDontLie doesn't provide quarter-by-quarter scores or lead changes
  // in the basic game endpoint. We'd need to call a separate endpoint or
  // calculate from play-by-play data (not available in free tier).
  //
  // For MVP, we'll work with what we have (final scores only).
  // In V1, we can:
  // 1. Use NBA Stats API for detailed quarter scores
  // 2. Or upgrade to BDL paid tier if they have this data

  // Placeholder for quarter scores (would need additional API calls)
  internalStats.quarterScores = [];

  // Placeholder for lead changes (would need play-by-play data)
  internalStats.leadChanges = undefined;
  internalStats.tiesCount = undefined;

  return internalStats;
}

/**
 * Maps BDL Stats to canonical PlayerStat
 */
export function mapPlayerStat(
  bdlStats: BDLStats,
  category: StatCategory,
  rank: number
): PlayerStat {
  // Extract the value for the requested category
  let value = 0;
  switch (category) {
    case 'points':
      value = bdlStats.pts;
      break;
    case 'rebounds':
      value = bdlStats.reb;
      break;
    case 'assists':
      value = bdlStats.ast;
      break;
    case 'steals':
      value = bdlStats.stl;
      break;
    case 'blocks':
      value = bdlStats.blk;
      break;
    case 'threePointMade':
      value = bdlStats.fg3m;
      break;
    case 'fieldGoalPercentage':
      value = bdlStats.fg_pct;
      break;
    case 'threePointPercentage':
      value = bdlStats.fg3_pct;
      break;
    case 'freeThrowPercentage':
      value = bdlStats.ft_pct;
      break;
    case 'turnovers':
      value = bdlStats.turnover;
      break;
    case 'minutes':
      // Minutes is a string like "38:25", convert to decimal
      value = parseMinutes(bdlStats.min);
      break;
  }

  return {
    playerId: bdlStats.player.id.toString(),
    player: mapPlayer(bdlStats.player),
    category,
    value,
    rank,
  };
}

/**
 * Helper: Parse minutes string "38:25" to decimal 38.42
 */
function parseMinutes(minutesStr: string): number {
  if (!minutesStr) return 0;
  const [mins, secs] = minutesStr.split(':').map(Number);
  return mins + secs / 60;
}

/**
 * Helper: Calculate lead changes from quarter scores
 * (Not available in BDL free tier - placeholder for future)
 */
export function calculateLeadChanges(quarterScores: QuarterScore[]): number {
  let leadChanges = 0;
  let currentLeader: 'away' | 'home' | 'tied' = 'tied';
  let awayTotal = 0;
  let homeTotal = 0;

  for (const quarter of quarterScores) {
    awayTotal += quarter.awayScore;
    homeTotal += quarter.homeScore;

    let newLeader: 'away' | 'home' | 'tied';
    if (awayTotal > homeTotal) {
      newLeader = 'away';
    } else if (homeTotal > awayTotal) {
      newLeader = 'home';
    } else {
      newLeader = 'tied';
    }

    if (newLeader !== currentLeader && currentLeader !== 'tied') {
      leadChanges++;
    }

    currentLeader = newLeader;
  }

  return leadChanges;
}

/**
 * Helper: Count ties from quarter scores
 * (Not available in BDL free tier - placeholder for future)
 */
export function calculateTies(quarterScores: QuarterScore[]): number {
  let ties = 0;
  let awayTotal = 0;
  let homeTotal = 0;

  for (const quarter of quarterScores) {
    awayTotal += quarter.awayScore;
    homeTotal += quarter.homeScore;

    if (awayTotal === homeTotal) {
      ties++;
    }
  }

  return ties;
}
