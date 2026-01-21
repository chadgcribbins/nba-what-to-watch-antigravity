'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { SlateOutput, RankedGame } from '@/lib/slate/slate-generator';
import type { UserProfile } from '@/lib/schemas/profile';
import { loadProfile } from '@/lib/storage/profile-storage';

export function SlateViewer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slate, setSlate] = useState<SlateOutput | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Load profile on mount (client-side only)
  useEffect(() => {
    const loadedProfile = loadProfile();
    setProfile(loadedProfile);
  }, []);

  const handleRunSlate = async (forceYesterday: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      // Get user's timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Build URL with optional profile
      let url = `/api/slate?timezone=${encodeURIComponent(timezone)}`;
      if (profile) {
        url += `&profile=${encodeURIComponent(JSON.stringify(profile))}`;
      }
      if (forceYesterday) {
        url += `&yesterday=true`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate slate');
      }

      const data = await response.json();
      console.log('[SlateViewer] Received slate data:', {
        timezone,
        hasProfile: !!profile,
        gamesCount: data.rankedGames?.length || 0,
        window: data.meta?.slateWindow,
        headline: data.shareSnapshot?.headline,
      });
      setSlate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {!slate && (
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-court-blue">
            NBA Watchability
          </h1>
          <p className="text-xl text-hardwood-medium max-w-md mx-auto">
            Discover which games are worth watching, with zero spoilers.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => handleRunSlate(false)}
                disabled={loading}
                className="px-8 py-4 bg-court-orange text-white font-bold text-lg rounded-lg hover:bg-opacity-90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading games...' : 'Run Previous Slate'}
              </button>
              <button
                onClick={() => handleRunSlate(true)}
                disabled={loading}
                className="px-8 py-4 bg-gray-600 text-white font-bold text-lg rounded-lg hover:bg-opacity-90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Loading...' : 'Test: Yesterday\'s Games'}
              </button>
            </div>

            {error && (
              <p className="text-sm text-error bg-error/10 p-4 rounded-lg">
                {error}
              </p>
            )}

            <div className="pt-2">
              <Link
                href="/preferences"
                className="inline-block text-sm text-court-blue hover:underline font-medium"
              >
                Configure your preferences → to get personalized rankings
              </Link>
            </div>
          </div>
        </div>
      )}

      {slate && (
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-court-blue">
              {slate.shareSnapshot.headline}
            </h1>
            <p className="text-sm text-hardwood-medium">
              {new Date(slate.meta.generatedAt).toLocaleString()}
            </p>
            
            {/* Tune Preferences Link */}
            <div className="pt-2">
              <Link
                href="/preferences"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <span>⚙️</span>
                <span>Tune Your Profile</span>
              </Link>
            </div>
          </div>

          {/* Ranked Games */}
          {slate.rankedGames.length === 0 ? (
            <div className="text-center py-12 bg-vintage-cream border-2 border-hardwood-light rounded-lg space-y-4">
              <p className="text-lg text-hardwood-medium">
                No games found in this slate window.
              </p>
              <Link
                href="/preferences"
                className="inline-block px-6 py-3 bg-court-blue text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Set Up Your Preferences
              </Link>
            </div>
          ) : (
            <>
              {/* Personalization hint */}
              {profile && (profile.teamRankings || profile.stylePreferences) && (
                <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    🎯 <strong>Personalized for you!</strong> These rankings factor in your preferences.{' '}
                    <Link href="/preferences" className="underline hover:no-underline">
                      Adjust settings
                    </Link>
                  </p>
                </div>
              )}
              
              <div className="space-y-4">
                {slate.rankedGames.map((game, index) => (
                  <GameCard key={game.gameId} game={game} rank={index + 1} />
                ))}
              </div>
            </>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <button
              onClick={() => setSlate(null)}
              className="px-6 py-3 bg-court-blue text-white font-semibold rounded-lg hover:bg-opacity-90 transition-colors"
            >
              Run Another Slate
            </button>
            <Link
              href="/preferences"
              className="px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              ⚙️ Tune Preferences
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function GameCard({ game, rank }: { game: RankedGame; rank: number }) {
  return (
    <div className="bg-white border-2 border-hardwood-light rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
      {/* Rank */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-vintage-gold text-hardwood-dark font-bold text-2xl rounded-full flex items-center justify-center">
            {rank}
          </div>

          <div>
            {/* Teams */}
            <h3 className="text-xl font-bold text-hardwood-dark">
              {game.awayTeam.city} {game.awayTeam.name} @ {game.homeTeam.city}{' '}
              {game.homeTeam.name}
            </h3>

            {/* Game Time */}
            <p className="text-sm text-hardwood-medium">
              {new Date(game.startTime).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Watchability Score */}
        <div className="text-right">
          <div className="text-2xl font-bold text-court-orange">
            {game.watchabilityScore}
          </div>
          <div className="text-xs text-hardwood-medium">score</div>
        </div>
      </div>

      {/* Tags */}
      {game.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {game.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-court-blue/10 text-court-blue text-sm font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Viewing Suggestion */}
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-hardwood-dark">
            Suggestion:
          </span>
          <span className="px-3 py-1 bg-hardwood-light/20 text-hardwood-dark text-sm font-medium rounded">
            {game.viewingSuggestion === 'condensed'
              ? 'Condensed is enough'
              : game.viewingSuggestion === 'fourth-quarter'
              ? 'Watch 4th quarter full'
              : 'Full game recommended'}
          </span>
        </div>

        {/* Watch Links */}
        <div className="flex gap-2">
          <a
            href={game.watchLinks.nbaApp}
            className="px-4 py-2 bg-court-orange text-white text-sm font-semibold rounded hover:bg-opacity-90 transition-colors"
          >
            NBA App
          </a>
          <a
            href={game.watchLinks.web}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 border-2 border-court-orange text-court-orange text-sm font-semibold rounded hover:bg-court-orange hover:text-white transition-colors"
          >
            NBA.com
          </a>
        </div>
      </div>
    </div>
  );
}
