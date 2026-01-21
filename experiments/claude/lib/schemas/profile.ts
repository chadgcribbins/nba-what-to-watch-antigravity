/**
 * User Profile Schema
 *
 * Single evolving profile per user (no multiple profiles in MVP).
 * User preferences are tiebreakers, not overrides - objective game quality comes first.
 *
 * Persisted to IndexedDB in MVP, server storage in V1.
 */

import { z } from 'zod';

/**
 * Player Bucket Types
 * Used to categorize players and influence game ranking
 */
export const PlayerBucket = z.enum([
  'must-see',  // Boost games with notable performances from these players
  'hooper',    // Positive signal, lighter boost than must-see
  'villain',   // Penalty - can push down even good games (-15 points)
  'goat',      // Optional special bucket for all-time greats
]);
export type PlayerBucket = z.infer<typeof PlayerBucket>;

/**
 * Individual player with bucket assignment
 */
export const PlayerPreference = z.object({
  playerId: z.string(),
  playerName: z.string(), // Stored for display purposes
  bucket: PlayerBucket,
  addedAt: z.date(),
});
export type PlayerPreference = z.infer<typeof PlayerPreference>;

/**
 * Team ranking entry
 * Order in array determines ranking (index 0 = favorite, index 29 = least favorite)
 */
export const TeamRanking = z.object({
  teamId: z.string(),
  teamName: z.string(), // Stored for display purposes
  rank: z.number().int().min(1).max(30), // 1-30 ranking
});
export type TeamRanking = z.infer<typeof TeamRanking>;

/**
 * Viewing style preferences
 * All preferences use a 1-5 scale (like star ratings)
 * 1 = Strongly prefer left side, 3 = Neutral, 5 = Strongly prefer right side
 *
 * These are tiebreakers - used when games have similar objective quality scores
 */
export const StylePreferences = z.object({
  // Offense vs Defense preference
  // 1 = love defensive battles, 3 = neutral, 5 = love shootouts
  offenseDefenseBalance: z.number().min(1).max(5).default(3),

  // Pace preference
  // 1 = love slow methodical, 3 = neutral, 5 = love fast-paced
  pacePreference: z.number().min(1).max(5).default(3),

  // Ball movement preference
  // 1 = don't care about assists, 3 = neutral, 5 = love team basketball
  ballMovementPreference: z.number().min(1).max(5).default(3),

  // Star power vs team balance
  // 1 = love balanced team efforts, 3 = neutral, 5 = love individual star shows
  starPowerPreference: z.number().min(1).max(5).default(3),

  // Physicality preference
  // 1 = prefer finesse, 3 = neutral, 5 = love physical chippy games
  physicalityPreference: z.number().min(1).max(5).default(3),
});
export type StylePreferences = z.infer<typeof StylePreferences>;

/**
 * Favorite player rule configuration
 * Controls when favorite players boost game rankings
 */
export const FavoritePlayerRule = z.object({
  // Only boost if player has a storyline (revenge game, milestone watch, etc.)
  requiresStoryline: z.boolean().default(true),

  // Minimum performance threshold to trigger boost
  // (e.g., only boost if player had notable performance)
  requiresNotablePerformance: z.boolean().default(false),
});
export type FavoritePlayerRule = z.infer<typeof FavoritePlayerRule>;

/**
 * Complete user profile
 */
export const UserProfile = z.object({
  // Metadata
  id: z.string().uuid(),
  createdAt: z.date(),
  lastModified: z.date(),
  version: z.number().int().default(1), // For schema migrations

  // Team preferences
  teamRankings: z.array(TeamRanking).length(30).optional(), // All 30 NBA teams
  favoriteTeam: z.string().optional(), // Quick reference to top team

  // Player preferences
  players: z.array(PlayerPreference).default([]),

  // Style preferences
  stylePreferences: StylePreferences.default({}),

  // Rules
  favoritePlayerRule: FavoritePlayerRule.default({}),

  // Personalization weights (advanced users can tune these)
  // These are applied AFTER objective quality scoring
  weights: z
    .object({
      favoriteTeamBoost: z.number().min(0).max(50).default(10), // Points added for favorite team games
      mustSeePlayerBoost: z.number().min(0).max(30).default(15), // Points added for must-see player notable performance
      hooperPlayerBoost: z.number().min(0).max(20).default(8), // Points added for hooper notable performance
      villainPenalty: z.number().min(0).max(30).default(15), // Points subtracted for villain involvement
      goatBoost: z.number().min(0).max(40).default(20), // Points added for GOAT player games
    })
    .default({}),
});
export type UserProfile = z.infer<typeof UserProfile>;

/**
 * Profile creation input (excludes auto-generated fields)
 */
export const CreateProfileInput = UserProfile.omit({
  id: true,
  createdAt: true,
  lastModified: true,
  version: true,
});
export type CreateProfileInput = z.infer<typeof CreateProfileInput>;

/**
 * Profile update input (all fields optional except id)
 */
export const UpdateProfileInput = UserProfile.partial().required({ id: true });
export type UpdateProfileInput = z.infer<typeof UpdateProfileInput>;

/**
 * Validation helpers
 */

/**
 * Validates that team rankings include all 30 teams exactly once
 */
export function validateTeamRankings(rankings: TeamRanking[]): boolean {
  if (rankings.length !== 30) return false;

  const uniqueTeamIds = new Set(rankings.map((r) => r.teamId));
  if (uniqueTeamIds.size !== 30) return false;

  const ranks = rankings.map((r) => r.rank).sort((a, b) => a - b);
  for (let i = 0; i < 30; i++) {
    if (ranks[i] !== i + 1) return false;
  }

  return true;
}

/**
 * Validates that player buckets don't have duplicates
 */
export function validatePlayerBuckets(players: PlayerPreference[]): boolean {
  const uniquePlayerIds = new Set(players.map((p) => p.playerId));
  return uniquePlayerIds.size === players.length;
}

/**
 * Gets players in a specific bucket
 */
export function getPlayersByBucket(
  profile: UserProfile,
  bucket: PlayerBucket
): PlayerPreference[] {
  return profile.players.filter((p) => p.bucket === bucket);
}

/**
 * Gets team rank by team ID
 * Returns undefined if team not found or rankings not set
 */
export function getTeamRank(
  profile: UserProfile,
  teamId: string
): number | undefined {
  if (!profile.teamRankings) return undefined;
  const team = profile.teamRankings.find((t) => t.teamId === teamId);
  return team?.rank;
}

/**
 * Default profile for new users
 */
export function createDefaultProfile(): UserProfile {
  return {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    lastModified: new Date(),
    version: 1,
    players: [],
    stylePreferences: {
      offenseDefenseBalance: 3,
      pacePreference: 3,
      ballMovementPreference: 3,
      starPowerPreference: 3,
      physicalityPreference: 3,
    },
    favoritePlayerRule: {
      requiresStoryline: true,
      requiresNotablePerformance: false,
    },
    weights: {
      favoriteTeamBoost: 10,
      mustSeePlayerBoost: 15,
      hooperPlayerBoost: 8,
      villainPenalty: 15,
      goatBoost: 20,
    },
  };
}
