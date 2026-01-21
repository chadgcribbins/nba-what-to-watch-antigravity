/**
 * NBA Stats API Client
 *
 * Unofficial but widely-used NBA Stats API
 * - Free, unlimited requests
 * - No API key required
 * - More detailed stats than BallDontLie
 *
 * Base URL: https://stats.nba.com/stats/
 */

import { DataProviderError, NetworkError } from '../types';

/**
 * NBA Stats API Response Types
 */

export interface NBAStatsResponse<T = any> {
  resource: string;
  parameters: Record<string, any>;
  resultSets: Array<{
    name: string;
    headers: string[];
    rowSet: any[][];
  }>;
}

export interface NBAStatsTeam {
  TEAM_ID: number;
  ABBREVIATION: string;
  NICKNAME: string;
  YEARFOUNDED: number;
  CITY: string;
  ARENA: string;
  ARENACAPACITY: number;
  OWNER: string;
  GENERALMANAGER: string;
  HEADCOACH: string;
  DLEAGUEAFFILIATION: string;
}

export interface NBAStatsGame {
  GAME_ID: string;
  GAME_DATE: string;
  MATCHUP: string;
  HOME_TEAM_ID: number;
  VISITOR_TEAM_ID: number;
  HOME_TEAM_SCORE?: number;
  VISITOR_TEAM_SCORE?: number;
  GAME_STATUS_TEXT: string;
  WL?: string;
}

/**
 * NBA Stats API Client Configuration
 */
export interface NBAStatsClientConfig {
  baseUrl?: string;
  timeout?: number;
}

/**
 * NBA Stats API Client
 */
export class NBAStatsClient {
  private baseUrl: string;
  private timeout: number;

  constructor(config: NBAStatsClientConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://stats.nba.com/stats';
    this.timeout = config.timeout || 10000;
  }

  /**
   * Fetch scoreboard for a specific date
   * Returns all games on that date
   */
  async getScoreboard(date: Date): Promise<NBAStatsResponse> {
    const dateStr = this.formatDate(date);
    const params = new URLSearchParams({
      GameDate: dateStr,
      LeagueID: '00', // NBA
      DayOffset: '0',
    });

    return this.fetch(`/scoreboardv2?${params.toString()}`);
  }

  /**
   * Fetch box score for a specific game
   */
  async getBoxScore(gameId: string): Promise<NBAStatsResponse> {
    const params = new URLSearchParams({
      GameID: gameId,
      StartPeriod: '0',
      EndPeriod: '10',
      StartRange: '0',
      EndRange: '28800',
      RangeType: '0',
    });

    return this.fetch(`/boxscoretraditionalv2?${params.toString()}`);
  }

  /**
   * Fetch all teams
   */
  async getTeams(): Promise<NBAStatsResponse> {
    return this.fetch('/commonteamyears?LeagueID=00');
  }

  /**
   * Fetch team roster
   */
  async getTeamRoster(teamId: number, season: string): Promise<NBAStatsResponse> {
    const params = new URLSearchParams({
      TeamID: teamId.toString(),
      Season: season,
    });

    return this.fetch(`/commonteamroster?${params.toString()}`);
  }

  /**
   * Fetch season leaders
   */
  async getLeaders(statCategory: string, season: string): Promise<NBAStatsResponse> {
    const params = new URLSearchParams({
      LeagueID: '00',
      PerMode: 'PerGame',
      Scope: 'S',
      Season: season,
      SeasonType: 'Regular Season',
      StatCategory: statCategory,
    });

    return this.fetch(`/leagueLeaders?${params.toString()}`);
  }

  /**
   * Health check
   */
  async ping(): Promise<boolean> {
    try {
      await this.getTeams();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generic fetch with NBA Stats API headers
   */
  private async fetch(path: string): Promise<NBAStatsResponse> {
    const url = `${this.baseUrl}${path}`;

    // NBA Stats API requires specific headers to work
    const headers = {
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Connection': 'keep-alive',
      'Host': 'stats.nba.com',
      'Origin': 'https://www.nba.com',
      'Referer': 'https://www.nba.com/',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'x-nba-stats-origin': 'stats',
      'x-nba-stats-token': 'true',
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new DataProviderError(
          `NBA Stats API request failed: ${response.statusText}`,
          'nba-stats',
          `HTTP_${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof DataProviderError) {
        throw error;
      }

      throw new NetworkError('nba-stats', error as Error);
    }
  }

  /**
   * Format date for NBA Stats API (MM/DD/YYYY)
   */
  private formatDate(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }

  /**
   * Get current NBA season string (e.g., "2024-25")
   */
  getCurrentSeason(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    // NBA season starts in October
    if (month >= 10) {
      return `${year}-${String(year + 1).slice(-2)}`;
    } else {
      return `${year - 1}-${String(year).slice(-2)}`;
    }
  }
}
