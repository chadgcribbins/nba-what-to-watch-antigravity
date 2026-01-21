/**
 * Canonical Internal Schema for NBA Data
 *
 * This schema is provider-agnostic. All external data sources
 * must be mapped to this internal representation.
 *
 * Critical: These types never include spoilers (scores, winners) in UI-facing code.
 * Internal stats are for algorithm use only.
 */

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  conference: 'East' | 'West';
  division: string;
  fullName: string;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  teamId: string;
  position?: string;
  jerseyNumber?: string;
}

export interface Game {
  id: string;
  startTime: Date;
  finalTime: Date | null;
  awayTeamId: string;
  homeTeamId: string;
  status: 'scheduled' | 'in_progress' | 'final';

  // Internal only - NEVER exposed to UI
  internalStats: InternalGameStats;
}

export interface GameDetails extends Game {
  awayTeam: Team;
  homeTeam: Team;
  participants: Player[];
}

/**
 * Internal Stats - For Algorithm Use Only
 * These numbers are used for ranking but NEVER displayed to users
 */
export interface InternalGameStats {
  finalMargin?: number;
  quarterScores: QuarterScore[];
  totalPoints?: number;
  leadChanges?: number;
  tiesCount?: number;
}

export interface QuarterScore {
  period: number;
  awayScore: number;
  homeScore: number;
}

export type StatCategory =
  | 'points'
  | 'rebounds'
  | 'assists'
  | 'steals'
  | 'blocks'
  | 'threePointMade'
  | 'fieldGoalPercentage'
  | 'threePointPercentage'
  | 'freeThrowPercentage'
  | 'turnovers'
  | 'minutes';

export interface PlayerStat {
  playerId: string;
  player: Player;
  category: StatCategory;
  value: number;
  rank: number;
}

/**
 * Data Provider Interface
 * All providers must implement this interface
 */
export interface DataProvider {
  name: string;

  // Schedule & Games
  getGamesInWindow(start: Date, end: Date): Promise<Game[]>;
  getGameDetails(gameId: string): Promise<GameDetails>;

  // Teams & Players
  getAllTeams(): Promise<Team[]>;
  getTeamRoster(teamId: string): Promise<Player[]>;

  // Stats & Leaders
  getSeasonLeaders(category: StatCategory, limit?: number): Promise<PlayerStat[]>;

  // Health check
  ping(): Promise<boolean>;
}

/**
 * Provider Error Types
 */
export class DataProviderError extends Error {
  constructor(
    message: string,
    public provider: string,
    public code?: string
  ) {
    super(message);
    this.name = 'DataProviderError';
  }
}

export class RateLimitError extends DataProviderError {
  constructor(provider: string) {
    super('Rate limit exceeded', provider, 'RATE_LIMIT');
    this.name = 'RateLimitError';
  }
}

export class NetworkError extends DataProviderError {
  constructor(provider: string, originalError?: Error) {
    super(
      `Network error: ${originalError?.message || 'Unknown error'}`,
      provider,
      'NETWORK_ERROR'
    );
    this.name = 'NetworkError';
  }
}
