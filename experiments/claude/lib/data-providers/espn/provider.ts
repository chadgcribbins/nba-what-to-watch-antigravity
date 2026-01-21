/**
 * ESPN API Data Provider Implementation
 *
 * Implements the DataProvider interface using ESPN's scoreboard API
 * Free, real-time, no API key required
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
import { DataProviderError } from '../types';
import { ESPNClient, type ESPNClientConfig, type ESPNEvent } from './client';
import { mapScoreboardToGames, mapGameDetails, mapTeam } from './mapper';

/**
 * ESPN API Data Provider
 */
export class ESPNProvider implements DataProvider {
  name = 'espn';
  private client: ESPNClient;
  private teamCache?: Team[];
  private teamCacheTime?: number;
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  
  // Cache for game events - ESPN scoreboard has all the data we need
  private gameEventCache: Map<string, ESPNEvent> = new Map();

  constructor(config: ESPNClientConfig = {}) {
    this.client = new ESPNClient(config);
  }

  /**
   * Fetches games within a time window
   */
  async getGamesInWindow(start: Date, end: Date): Promise<Game[]> {
    console.log('[ESPNProvider] getGamesInWindow called:', {
      start: start.toISOString(),
      end: end.toISOString(),
      startLocal: start.toLocaleString(),
      endLocal: end.toLocaleString(),
    });

    try {
      // ESPN supports date ranges directly
      const response = await this.client.getScoreboardRange(start, end);
      
      // Cache all events for later detail lookups
      if (response.events) {
        for (const event of response.events) {
          this.gameEventCache.set(event.id, event);
        }
      }
      
      const games = mapScoreboardToGames(response);
      
      console.log('[ESPNProvider] Successfully fetched games:', {
        count: games.length,
        gameIds: games.map(g => g.id),
      });

      return games;
    } catch (error) {
      console.error('[ESPNProvider] Error fetching games:', error);
      throw error;
    }
  }

  /**
   * Fetches detailed game information
   * Note: ESPN's scoreboard already includes comprehensive details
   * We use the cached event data from previous getGamesInWindow calls
   */
  async getGameDetails(gameId: string): Promise<GameDetails> {
    console.log('[ESPNProvider] getGameDetails called:', { gameId });

    // Check cache first
    const cachedEvent = this.gameEventCache.get(gameId);
    if (cachedEvent) {
      console.log('[ESPNProvider] Using cached event for game:', gameId);
      return mapGameDetails(cachedEvent);
    }

    // If not in cache, we can't fetch it individually from ESPN
    // This shouldn't happen in normal flow since getGamesInWindow caches events
    throw new DataProviderError(
      `Game ${gameId} not found in cache. Call getGamesInWindow first to populate cache.`,
      'espn',
      'NOT_FOUND'
    );
  }

  /**
   * Fetches all NBA teams
   * ESPN doesn't have a dedicated teams endpoint, so we'll build from games
   */
  async getAllTeams(): Promise<Team[]> {
    const now = Date.now();

    // Return cached teams if still valid
    if (this.teamCache && this.teamCacheTime && now - this.teamCacheTime < this.CACHE_TTL) {
      console.log('[ESPNProvider] Returning cached teams');
      return this.teamCache;
    }

    console.log('[ESPNProvider] Fetching teams from recent games');

    try {
      // Fetch last 7 days of games to get all teams
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);

      const response = await this.client.getScoreboardRange(startDate, endDate);

      // Extract unique teams from all games
      const teamMap = new Map<string, Team>();

      for (const event of response.events || []) {
        const competition = event.competitions[0];
        if (!competition) continue;

        for (const competitor of competition.competitors) {
          const teamId = competitor.team.id;
          if (!teamMap.has(teamId)) {
            teamMap.set(teamId, mapTeam(competitor.team));
          }
        }
      }

      this.teamCache = Array.from(teamMap.values());
      this.teamCacheTime = now;

      console.log('[ESPNProvider] Cached teams:', {
        count: this.teamCache.length,
        teams: this.teamCache.map(t => t.abbreviation),
      });

      return this.teamCache;
    } catch (error) {
      console.error('[ESPNProvider] Error fetching teams:', error);
      throw error;
    }
  }

  /**
   * Fetches roster for a specific team
   * ESPN scoreboard doesn't include full rosters
   */
  async getTeamRoster(teamId: string): Promise<Player[]> {
    console.log('[ESPNProvider] getTeamRoster called:', { teamId });

    throw new DataProviderError(
      'ESPN provider does not support team roster lookup. Use a different provider for roster data.',
      'espn',
      'NOT_SUPPORTED'
    );
  }

  /**
   * Fetches season leaders for a stat category
   * ESPN scoreboard doesn't include season-wide stats
   */
  async getSeasonLeaders(
    category: StatCategory,
    limit: number = 10
  ): Promise<PlayerStat[]> {
    console.log('[ESPNProvider] getSeasonLeaders called:', { category, limit });

    throw new DataProviderError(
      'ESPN provider does not support season leaders lookup. Use a different provider for stat leaders.',
      'espn',
      'NOT_SUPPORTED'
    );
  }

  /**
   * Health check
   */
  async ping(): Promise<boolean> {
    try {
      const result = await this.client.ping();
      console.log('[ESPNProvider] Ping result:', result);
      return result;
    } catch (error) {
      console.error('[ESPNProvider] Ping failed:', error);
      return false;
    }
  }
}

/**
 * Factory function to create an ESPN provider instance
 */
export function createESPNProvider(config?: ESPNClientConfig): DataProvider {
  return new ESPNProvider(config);
}

