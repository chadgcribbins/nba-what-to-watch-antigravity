/**
 * ESPN API Client
 *
 * ESPN's publicly accessible scoreboard API
 * - Free, no API key required
 * - Real-time data (immediate updates)
 * - Comprehensive game information
 *
 * Base URL: https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba
 */

import { DataProviderError, NetworkError } from '../types';

/**
 * ESPN API Response Types
 */

export interface ESPNScoreboardResponse {
  leagues: Array<{
    id: string;
    name: string;
    abbreviation: string;
  }>;
  season: {
    year: number;
    type: number;
  };
  events: ESPNEvent[];
}

export interface ESPNEvent {
  id: string;
  uid: string;
  date: string; // ISO 8601
  name: string; // "Team A at Team B"
  shortName: string; // "TEAM1 @ TEAM2"
  competitions: ESPNCompetition[];
  status: {
    clock: number;
    displayClock: string;
    period: number;
    type: {
      id: string;
      name: string; // "STATUS_FINAL", "STATUS_IN_PROGRESS", etc.
      state: string; // "pre", "in", "post"
      completed: boolean;
      description: string;
      detail: string;
      shortDetail: string;
    };
  };
}

export interface ESPNCompetition {
  id: string;
  uid: string;
  date: string;
  attendance: number;
  type: {
    id: string;
    abbreviation: string;
  };
  timeValid: boolean;
  neutralSite: boolean;
  conferenceCompetition: boolean;
  playByPlayAvailable: boolean;
  recent: boolean;
  venue: {
    id: string;
    fullName: string;
    address: {
      city: string;
      state: string;
    };
  };
  competitors: ESPNCompetitor[];
  notes: any[];
  status: {
    clock: number;
    displayClock: string;
    period: number;
    type: {
      id: string;
      name: string;
      state: string;
      completed: boolean;
      description: string;
      detail: string;
      shortDetail: string;
    };
  };
  broadcasts: any[];
  leaders?: ESPNLeader[];
}

export interface ESPNCompetitor {
  id: string;
  uid: string;
  type: string;
  order: number;
  homeAway: 'home' | 'away';
  winner: boolean;
  team: {
    id: string;
    uid: string;
    location: string; // City
    name: string; // Team name
    abbreviation: string;
    displayName: string; // Full name
    shortDisplayName: string;
    color: string;
    alternateColor: string;
    isActive: boolean;
    logo: string;
  };
  score: string;
  linescores?: Array<{
    value: number;
  }>;
  statistics?: any[];
  records?: Array<{
    name: string;
    abbreviation: string;
    type: string;
    summary: string;
  }>;
}

export interface ESPNLeader {
  name: string;
  displayName: string;
  shortDisplayName: string;
  abbreviation: string;
  leaders: Array<{
    displayValue: string;
    value: number;
    athlete: {
      id: string;
      fullName: string;
      displayName: string;
      shortName: string;
      jersey: string;
      headshot: string;
      team: {
        id: string;
      };
      position: {
        abbreviation: string;
      };
    };
    team: {
      id: string;
    };
  }>;
}

/**
 * ESPN API Client Configuration
 */
export interface ESPNClientConfig {
  baseUrl?: string;
  timeout?: number;
}

/**
 * ESPN API Client
 */
export class ESPNClient {
  private baseUrl: string;
  private timeout: number;

  constructor(config: ESPNClientConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba';
    this.timeout = config.timeout || 10000;
  }

  /**
   * Fetch scoreboard for a specific date
   * @param date Date object or YYYYMMDD string
   * @returns Scoreboard data with all games for that date
   */
  async getScoreboard(date: Date | string): Promise<ESPNScoreboardResponse> {
    const dateStr = typeof date === 'string' ? date : this.formatDate(date);
    const url = `${this.baseUrl}/scoreboard?dates=${dateStr}`;
    
    return this.fetch(url);
  }

  /**
   * Fetch scoreboard for a date range
   * @param startDate Start date
   * @param endDate End date
   * @returns Scoreboard data for all dates in range
   */
  async getScoreboardRange(startDate: Date, endDate: Date): Promise<ESPNScoreboardResponse> {
    const startStr = this.formatDate(startDate);
    const endStr = this.formatDate(endDate);
    const url = `${this.baseUrl}/scoreboard?dates=${startStr}-${endStr}`;
    
    return this.fetch(url);
  }

  /**
   * Health check
   */
  async ping(): Promise<boolean> {
    try {
      // Try to fetch today's scoreboard
      await this.getScoreboard(new Date());
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Generic fetch with ESPN headers
   */
  private async fetch(url: string): Promise<any> {
    const headers = {
      'Accept': 'application/json',
      'Accept-Language': 'en-US,en;q=0.9',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://www.espn.com/',
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
          `ESPN API request failed: ${response.statusText}`,
          'espn',
          `HTTP_${response.status}`
        );
      }

      return response.json();
    } catch (error) {
      if (error instanceof DataProviderError) {
        throw error;
      }

      throw new NetworkError('espn', error as Error);
    }
  }

  /**
   * Format date for ESPN API (YYYYMMDD)
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }
}

