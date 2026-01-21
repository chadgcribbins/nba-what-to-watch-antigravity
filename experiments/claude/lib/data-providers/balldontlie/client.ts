/**
 * BallDontLie.io API Client
 *
 * Free NBA data API - no API key required for basic usage
 * API Docs: https://docs.balldontlie.io
 *
 * Rate Limits (Free Tier):
 * - 60 requests per minute
 * - No API key required
 */

import {
  DataProviderError,
  RateLimitError,
  NetworkError,
} from '../types';

/**
 * BallDontLie API Response Types
 * These match the external API schema (not our canonical schema)
 */

export interface BDLTeam {
  id: number;
  conference: string;
  division: string;
  city: string;
  name: string;
  full_name: string;
  abbreviation: string;
}

export interface BDLGame {
  id: number;
  date: string; // ISO 8601
  season: number;
  status: string; // "Final", "In Progress", etc.
  period: number;
  time: string;
  postseason: boolean;
  home_team_score: number;
  visitor_team_score: number;
  home_team: BDLTeam;
  visitor_team: BDLTeam;
}

export interface BDLPlayer {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  jersey_number: string;
  college: string;
  country: string;
  draft_year: number | null;
  draft_round: number | null;
  draft_number: number | null;
  team: BDLTeam;
}

export interface BDLStats {
  id: number;
  min: string;
  fgm: number;
  fga: number;
  fg_pct: number;
  fg3m: number;
  fg3a: number;
  fg3_pct: number;
  ftm: number;
  fta: number;
  ft_pct: number;
  oreb: number;
  dreb: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  turnover: number;
  pf: number;
  pts: number;
  player: BDLPlayer;
  game: BDLGame;
  team: BDLTeam;
}

export interface BDLPaginatedResponse<T> {
  data: T[];
  meta: {
    total_pages: number;
    current_page: number;
    next_page: number | null;
    per_page: number;
    total_count: number;
  };
}

/**
 * BallDontLie API Client Configuration
 */
export interface BDLClientConfig {
  baseUrl?: string;
  apiKey?: string; // Optional for paid tier
  timeout?: number; // Request timeout in ms
}

/**
 * BallDontLie API Client
 */
export class BallDontLieClient {
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;

  constructor(config: BDLClientConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://api.balldontlie.io/v1';
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 10000; // 10 second default
  }

  /**
   * Fetch games within a date range
   *
   * @param startDate - Start date (inclusive)
   * @param endDate - End date (inclusive)
   * @returns Array of games
   */
  async getGames(startDate: Date, endDate: Date): Promise<BDLGame[]> {
    const params = new URLSearchParams({
      start_date: this.formatDate(startDate),
      end_date: this.formatDate(endDate),
      per_page: '100', // Max per page
    });

    return this.fetchPaginated<BDLGame>(`/games?${params.toString()}`);
  }

  /**
   * Fetch a single game by ID
   */
  async getGame(gameId: number): Promise<BDLGame> {
    return this.fetch<BDLGame>(`/games/${gameId}`);
  }

  /**
   * Fetch all teams
   */
  async getTeams(): Promise<BDLTeam[]> {
    return this.fetchPaginated<BDLTeam>('/teams');
  }

  /**
   * Fetch players (optionally filtered by team)
   */
  async getPlayers(teamId?: number): Promise<BDLPlayer[]> {
    const params = teamId
      ? new URLSearchParams({ team_ids: teamId.toString(), per_page: '100' })
      : new URLSearchParams({ per_page: '100' });

    return this.fetchPaginated<BDLPlayer>(`/players?${params.toString()}`);
  }

  /**
   * Fetch stats for a specific game
   */
  async getGameStats(gameId: number): Promise<BDLStats[]> {
    const params = new URLSearchParams({
      game_ids: gameId.toString(),
      per_page: '100',
    });

    return this.fetchPaginated<BDLStats>(`/stats?${params.toString()}`);
  }

  /**
   * Fetch season leaders for a stat category
   */
  async getSeasonLeaders(
    season: number,
    statCategory: string,
    limit: number = 10
  ): Promise<BDLStats[]> {
    const params = new URLSearchParams({
      season: season.toString(),
      per_page: limit.toString(),
    });

    // Note: BDL doesn't have a direct "leaders" endpoint
    // We'll fetch stats and sort client-side
    const stats = await this.fetchPaginated<BDLStats>(
      `/stats?${params.toString()}`
    );

    // Sort by the requested stat category
    return stats
      .sort((a, b) => {
        const aVal = (a as any)[statCategory] || 0;
        const bVal = (b as any)[statCategory] || 0;
        return bVal - aVal;
      })
      .slice(0, limit);
  }

  /**
   * Health check - ping the API
   */
  async ping(): Promise<boolean> {
    try {
      await this.fetch('/teams?per_page=1');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generic fetch with error handling and retry logic
   */
  private async fetch<T>(path: string, retries = 3): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = this.apiKey;
    }

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          headers,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle rate limiting with exponential backoff
        if (response.status === 429) {
          if (attempt < retries) {
            const delay = Math.pow(2, attempt) * 2000; // 2s, 4s, 8s
            console.log(`Rate limited. Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }
          throw new RateLimitError('balldontlie');
        }

        // Handle other errors
        if (!response.ok) {
          throw new DataProviderError(
            `API request failed: ${response.statusText}`,
            'balldontlie',
            `HTTP_${response.status}`
          );
        }

        return response.json();
      } catch (error) {
        if (error instanceof RateLimitError) {
          throw error; // Already retried
        }

        if (error instanceof DataProviderError) {
          throw error;
        }

        // Network errors - retry
        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        // Out of retries
        throw new NetworkError('balldontlie', error as Error);
      }
    }

    // Should never reach here, but TypeScript needs it
    throw new Error('Unexpected error in fetch');
  }

  /**
   * Fetch all pages of a paginated endpoint
   */
  private async fetchPaginated<T>(path: string): Promise<T[]> {
    const results: T[] = [];
    let currentPage = 1;
    let hasMore = true;

    while (hasMore) {
      const separator = path.includes('?') ? '&' : '?';
      const url = `${path}${separator}page=${currentPage}`;

      const response = await this.fetch<BDLPaginatedResponse<T>>(url);
      results.push(...response.data);

      hasMore = response.meta.next_page !== null;
      currentPage++;

      // Safety limit - don't fetch more than 10 pages
      if (currentPage > 10) {
        console.warn('Reached pagination safety limit (10 pages)');
        break;
      }
    }

    return results;
  }

  /**
   * Format date for API (YYYY-MM-DD)
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
