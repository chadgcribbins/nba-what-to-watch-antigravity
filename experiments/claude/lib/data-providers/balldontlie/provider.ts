/**
 * BallDontLie Data Provider Implementation
 *
 * Implements the DataProvider interface using BallDontLie API.
 * Handles fetching, mapping, and caching of NBA data.
 */

import type {
  DataProvider,
  Game,
  GameDetails,
  Team,
  Player,
  PlayerStat,
  StatCategory,
} from '../types';
import { BallDontLieClient, type BDLClientConfig } from './client';
import { mapTeam, mapPlayer, mapGame, mapGameDetails, mapPlayerStat } from './mapper';

/**
 * BallDontLie Data Provider
 */
export class BallDontLieProvider implements DataProvider {
  name = 'balldontlie';
  private client: BallDontLieClient;
  private teamCache?: Team[];
  private teamCacheTime?: number;
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor(config: BDLClientConfig = {}) {
    this.client = new BallDontLieClient(config);
  }

  /**
   * Fetches games within a time window
   */
  async getGamesInWindow(start: Date, end: Date): Promise<Game[]> {
    const bdlGames = await this.client.getGames(start, end);

    // Map to canonical schema
    // Note: We're not fetching stats for each game here (too many API calls)
    // Stats will be fetched in getGameDetails when needed
    return bdlGames.map((bdlGame) => mapGame(bdlGame));
  }

  /**
   * Fetches detailed game information including stats
   */
  async getGameDetails(gameId: string): Promise<GameDetails> {
    const gameIdNum = parseInt(gameId, 10);

    // Fetch game and stats in parallel
    const [bdlGame, bdlStats] = await Promise.all([
      this.client.getGame(gameIdNum),
      this.client.getGameStats(gameIdNum),
    ]);

    return mapGameDetails(bdlGame, bdlStats);
  }

  /**
   * Fetches all NBA teams
   * Results are cached for 24 hours (teams don't change often)
   */
  async getAllTeams(): Promise<Team[]> {
    const now = Date.now();

    // Return cached teams if still valid
    if (this.teamCache && this.teamCacheTime && now - this.teamCacheTime < this.CACHE_TTL) {
      return this.teamCache;
    }

    // Fetch fresh teams
    const bdlTeams = await this.client.getTeams();
    this.teamCache = bdlTeams.map(mapTeam);
    this.teamCacheTime = now;

    return this.teamCache;
  }

  /**
   * Fetches roster for a specific team
   */
  async getTeamRoster(teamId: string): Promise<Player[]> {
    const teamIdNum = parseInt(teamId, 10);
    const bdlPlayers = await this.client.getPlayers(teamIdNum);
    return bdlPlayers.map(mapPlayer);
  }

  /**
   * Fetches season leaders for a stat category
   */
  async getSeasonLeaders(
    category: StatCategory,
    limit: number = 10
  ): Promise<PlayerStat[]> {
    // Get current season (TODO: make this configurable)
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    // NBA season starts in October, so if we're before October, use previous year
    const season = currentMonth < 9 ? currentYear - 1 : currentYear;

    // Map our category to BDL stat field
    const bdlStatField = mapCategoryToBDLField(category);

    // Fetch stats from BDL
    const bdlStats = await this.client.getSeasonLeaders(season, bdlStatField, limit);

    // Map to canonical schema with rankings
    return bdlStats.map((stat, index) => mapPlayerStat(stat, category, index + 1));
  }

  /**
   * Health check
   */
  async ping(): Promise<boolean> {
    return this.client.ping();
  }
}

/**
 * Maps our canonical stat category to BDL field name
 */
function mapCategoryToBDLField(category: StatCategory): string {
  switch (category) {
    case 'points':
      return 'pts';
    case 'rebounds':
      return 'reb';
    case 'assists':
      return 'ast';
    case 'steals':
      return 'stl';
    case 'blocks':
      return 'blk';
    case 'threePointMade':
      return 'fg3m';
    case 'fieldGoalPercentage':
      return 'fg_pct';
    case 'threePointPercentage':
      return 'fg3_pct';
    case 'freeThrowPercentage':
      return 'ft_pct';
    case 'turnovers':
      return 'turnover';
    case 'minutes':
      return 'min';
    default:
      throw new Error(`Unsupported stat category: ${category}`);
  }
}

/**
 * Factory function to create a BallDontLie provider instance
 */
export function createBallDontLieProvider(config?: BDLClientConfig): DataProvider {
  return new BallDontLieProvider(config);
}
