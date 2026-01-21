/**
 * Slate Generation API Route
 *
 * Generates the previous slate of games with spoiler-free rankings
 */

import { NextResponse } from 'next/server';
import { createBallDontLieProvider } from '@/lib/data-providers/balldontlie/provider';
import { createNBAStatsProvider } from '@/lib/data-providers/nba-stats/provider';
import { createESPNProvider } from '@/lib/data-providers/espn/provider';
import { createFallbackProvider } from '@/lib/data-providers/fallback-provider';
import { generateSlate, createPreviousSlateWindow } from '@/lib/slate/slate-generator';

export async function GET(request: Request) {
  try {
    // Get timezone and optional profile from query params
    const { searchParams } = new URL(request.url);
    const timezone = searchParams.get('timezone') || 'America/New_York';
    const profileJson = searchParams.get('profile');

    // Create fallback provider: ESPN (primary, real-time) -> NBA Stats (fallback)
    // ESPN provides real-time data with no API key required
    // NBA Stats has 12-24 hour delay but is reliable for historical data
    const espn = createESPNProvider();
    const nbaStats = createNBAStatsProvider();

    const provider = createFallbackProvider([espn, nbaStats], {
      fallbackOnRateLimit: true,
      fallbackOnError: true, // Fallback on any error since ESPN is experimental
    });

    // Check if we want to force yesterday's slate (for testing)
    const forceYesterday = searchParams.get('yesterday') === 'true';
    
    // Generate slate for previous day (most recent complete day of games)
    let window;
    if (forceYesterday) {
      // Force yesterday's complete slate (for testing)
      const now = new Date();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const yesterdayStart = new Date(yesterday);
      yesterdayStart.setHours(7, 30, 0, 0);
      const yesterdayEnd = new Date(now);
      yesterdayEnd.setHours(7, 30, 0, 0);
      
      window = {
        start: yesterdayStart,
        end: yesterdayEnd,
        timezone,
      };
      
      console.log('[Slate API] Using YESTERDAY slate window (test mode):', {
        start: window.start.toISOString(),
        end: window.end.toISOString(),
        timezone: window.timezone,
      });
    } else {
      window = createPreviousSlateWindow(timezone);
      
      console.log('[Slate API] Using previous slate window:', {
        start: window.start.toISOString(),
        end: window.end.toISOString(),
        timezone: window.timezone,
      });
    }

    // Parse profile if provided
    let profile;
    if (profileJson) {
      try {
        profile = JSON.parse(profileJson);
        console.log('[Slate API] Using user profile for personalization');
      } catch (error) {
        console.error('[Slate API] Failed to parse profile:', error);
        // Continue without profile
      }
    }

    // Generate slate with optional profile
    const slate = await generateSlate(provider, window, profile);

    console.log('[Slate API] Generated slate:', {
      gamesCount: slate.rankedGames.length,
      headline: slate.shareSnapshot.headline,
    });

    return NextResponse.json(slate);
  } catch (error) {
    console.error('Error generating slate:', error);

    return NextResponse.json(
      {
        error: 'Failed to generate slate',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
