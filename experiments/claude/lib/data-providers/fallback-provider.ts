/**
 * Fallback Data Provider
 *
 * Tries multiple providers in order, falling back on errors
 * Primary use case: BallDontLie (with API key) -> NBA Stats (unlimited, free)
 */

import type {
  DataProvider,
  Game,
  GameDetails,
  Team,
  Player,
  PlayerStat,
  StatCategory,
} from './types';
import { RateLimitError, DataProviderError } from './types';

export interface FallbackProviderConfig {
  providers: DataProvider[];
  fallbackOnRateLimit?: boolean;
  fallbackOnError?: boolean;
}

/**
 * Fallback Data Provider
 *
 * Tries providers in order until one succeeds.
 * Automatically falls back on rate limit errors.
 */
export class FallbackProvider implements DataProvider {
  name: string;
  private providers: DataProvider[];
  private fallbackOnRateLimit: boolean;
  private fallbackOnError: boolean;

  constructor(config: FallbackProviderConfig) {
    this.providers = config.providers;
    this.fallbackOnRateLimit = config.fallbackOnRateLimit ?? true;
    this.fallbackOnError = config.fallbackOnError ?? false;
    this.name = `fallback(${this.providers.map(p => p.name).join(' -> ')})`;
  }

  /**
   * Try each provider in order until one succeeds
   */
  private async tryProviders<T>(
    operation: (provider: DataProvider) => Promise<T>
  ): Promise<T> {
    let lastError: Error | undefined;

    for (let i = 0; i < this.providers.length; i++) {
      const provider = this.providers[i];

      try {
        console.log(`[FallbackProvider] Trying provider: ${provider.name}`);
        const result = await operation(provider);
        console.log(`[FallbackProvider] Success with: ${provider.name}`);
        return result;
      } catch (error) {
        lastError = error as Error;

        // Decide whether to try next provider
        const shouldFallback = this.shouldFallback(error as Error, i);

        if (shouldFallback) {
          console.log(
            `[FallbackProvider] ${provider.name} failed: ${(error as Error).message}. Trying next provider...`
          );
          continue;
        } else {
          // Don't fallback, throw immediately
          throw error;
        }
      }
    }

    // All providers failed
    throw new DataProviderError(
      `All providers failed. Last error: ${lastError?.message}`,
      this.name,
      'ALL_FAILED'
    );
  }

  /**
   * Determine if we should try the next provider
   */
  private shouldFallback(error: Error, currentProviderIndex: number): boolean {
    // If this is the last provider, don't fallback
    if (currentProviderIndex >= this.providers.length - 1) {
      return false;
    }

    // Always fallback on rate limit errors
    if (error instanceof RateLimitError && this.fallbackOnRateLimit) {
      return true;
    }

    // Fallback on other errors if configured
    if (this.fallbackOnError && error instanceof DataProviderError) {
      return true;
    }

    // Don't fallback for unexpected errors
    return false;
  }

  async getGamesInWindow(start: Date, end: Date): Promise<Game[]> {
    return this.tryProviders(provider => provider.getGamesInWindow(start, end));
  }

  async getGameDetails(gameId: string): Promise<GameDetails> {
    return this.tryProviders(provider => provider.getGameDetails(gameId));
  }

  async getAllTeams(): Promise<Team[]> {
    return this.tryProviders(provider => provider.getAllTeams());
  }

  async getTeamRoster(teamId: string): Promise<Player[]> {
    return this.tryProviders(provider => provider.getTeamRoster(teamId));
  }

  async getSeasonLeaders(category: StatCategory, limit?: number): Promise<PlayerStat[]> {
    return this.tryProviders(provider => provider.getSeasonLeaders(category, limit));
  }

  async ping(): Promise<boolean> {
    // For ping, try all providers and return true if any succeed
    for (const provider of this.providers) {
      try {
        const result = await provider.ping();
        if (result) return true;
      } catch {
        continue;
      }
    }
    return false;
  }
}

/**
 * Factory function to create a fallback provider
 */
export function createFallbackProvider(
  providers: DataProvider[],
  options?: Partial<FallbackProviderConfig>
): DataProvider {
  return new FallbackProvider({
    providers,
    ...options,
  });
}
