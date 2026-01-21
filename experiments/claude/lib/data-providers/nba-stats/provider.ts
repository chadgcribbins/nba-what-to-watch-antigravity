/**
 * NBA Stats API Data Provider Implementation
 *
 * Implements the DataProvider interface using NBA Stats API
 * Free, unlimited, no API key required
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
import { NBAStatsClient, type NBAStatsClientConfig } from './client';
import {
  mapScoreboardToGames,
  mapBoxScoreToGameDetails,
  mapTeam,
  mapPlayer,
} from './mapper';

/**
 * NBA Stats API Data Provider
 */
export class NBAStatsProvider implements DataProvider {
  name = 'nba-stats';
  private client: NBAStatsClient;
  private teamCache?: Team[];
  private teamCacheTime?: number;
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor(config: NBAStatsClientConfig = {}) {
    this.client = new NBAStatsClient(config);
  }

  /**
   * Fetches games within a time window
   */
  async getGamesInWindow(start: Date, end: Date): Promise<Game[]> {
    console.log('[NBAStatsProvider] getGamesInWindow called:', {
      start: start.toISOString(),
      end: end.toISOString(),
      startLocal: start.toLocaleString(),
      endLocal: end.toLocaleString(),
    });

    const allGames: Game[] = [];

    // NBA Stats API requires fetching by date, so iterate through dates
    const currentDate = new Date(start);
    while (currentDate <= end) {
      try {
        const dateStr = currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        console.log('[NBAStatsProvider] Fetching scoreboard for date:', {
          date: currentDate.toISOString(),
          formatted: dateStr,
        });
        const response = await this.client.getScoreboard(currentDate);
        const games = mapScoreboardToGames(response);
        console.log('[NBAStatsProvider] Found games for date:', {
          date: currentDate.toISOString(),
          count: games.length,
          gameIds: games.map(g => g.id),
        });
        allGames.push(...games);
      } catch (error) {
        console.error(`Failed to fetch games for ${currentDate.toISOString()}:`, error);
        // Continue with other dates
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log('[NBAStatsProvider] Total games found:', allGames.length);
    return allGames;
  }

  /**
   * Fetches detailed game information
   */
  async getGameDetails(gameId: string): Promise<GameDetails> {
    // First get the game from scoreboard to have basic info
    // We need to know the game date, but we can try fetching box score directly
    const boxScoreResponse = await this.client.getBoxScore(gameId);

    // Create a minimal game object (we'll enhance it from box score)
    const game: Game = {
      id: gameId,
      startTime: new Date(), // Will be updated from box score if available
      finalTime: null,
      awayTeamId: '',
      homeTeamId: '',
      status: 'final',
      internalStats: {
        quarterScores: [],
      },
    };

    return mapBoxScoreToGameDetails(game, boxScoreResponse);
  }

  /**
   * Fetches all NBA teams
   */
  async getAllTeams(): Promise<Team[]> {
    const now = Date.now();

    // Return cached teams if still valid
    if (this.teamCache && this.teamCacheTime && now - this.teamCacheTime < this.CACHE_TTL) {
      return this.teamCache;
    }

    // Fetch fresh teams
    const response = await this.client.getTeams();

    const teamSet = response.resultSets[0];
    if (!teamSet) {
      return [];
    }

    this.teamCache = teamSet.rowSet.map((row: any[]) => {
      const teamData: any = {};
      teamSet.headers.forEach((header: string, index: number) => {
        teamData[header] = row[index];
      });
      return mapTeam(teamData);
    });

    this.teamCacheTime = now;
    return this.teamCache;
  }

  /**
   * Fetches roster for a specific team
   */
  async getTeamRoster(teamId: string): Promise<Player[]> {
    const season = this.client.getCurrentSeason();
    const response = await this.client.getTeamRoster(parseInt(teamId, 10), season);

    const rosterSet = response.resultSets.find(rs => rs.name === 'CommonTeamRoster');
    if (!rosterSet) {
      return [];
    }

    return rosterSet.rowSet.map((row: any[]) => {
      const playerData: any = {};
      rosterSet.headers.forEach((header: string, index: number) => {
        playerData[header] = row[index];
      });
      return mapPlayer(playerData);
    });
  }

  /**
   * Fetches season leaders for a stat category
   */
  async getSeasonLeaders(
    category: StatCategory,
    limit: number = 10
  ): Promise<PlayerStat[]> {
    const season = this.client.getCurrentSeason();
    const statCategory = mapCategoryToNBAStatsField(category);

    const response = await this.client.getLeaders(statCategory, season);

    const leaderSet = response.resultSets[0];
    if (!leaderSet) {
      return [];
    }

    const leaders = leaderSet.rowSet.slice(0, limit).map((row: any[], index: number) => {
      const leaderData: any = {};
      leaderSet.headers.forEach((header: string, idx: number) => {
        leaderData[header] = row[idx];
      });

      return {
        playerId: leaderData.PLAYER_ID?.toString(),
        player: mapPlayer(leaderData),
        category,
        value: leaderData[statCategory] || 0,
        rank: index + 1,
      };
    });

    return leaders;
  }

  /**
   * Health check
   */
  async ping(): Promise<boolean> {
    return this.client.ping();
  }
}

/**
 * Maps our canonical stat category to NBA Stats API field name
 */
function mapCategoryToNBAStatsField(category: StatCategory): string {
  switch (category) {
    case 'points':
      return 'PTS';
    case 'rebounds':
      return 'REB';
    case 'assists':
      return 'AST';
    case 'steals':
      return 'STL';
    case 'blocks':
      return 'BLK';
    case 'threePointMade':
      return 'FG3M';
    case 'fieldGoalPercentage':
      return 'FG_PCT';
    case 'threePointPercentage':
      return 'FG3_PCT';
    case 'freeThrowPercentage':
      return 'FT_PCT';
    case 'turnovers':
      return 'TOV';
    case 'minutes':
      return 'MIN';
    default:
      throw new Error(`Unsupported stat category: ${category}`);
  }
}

/**
 * Factory function to create an NBA Stats provider instance
 */
export function createNBAStatsProvider(config?: NBAStatsClientConfig): DataProvider {
  return new NBAStatsProvider(config);
}
