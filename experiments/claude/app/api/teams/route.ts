/**
 * Teams API Route
 * 
 * Returns all 30 NBA teams for ranking/selection
 */

import { NextResponse } from 'next/server';
import { createESPNProvider } from '@/lib/data-providers/espn/provider';
import { createNBAStatsProvider } from '@/lib/data-providers/nba-stats/provider';
import { createFallbackProvider } from '@/lib/data-providers/fallback-provider';

export async function GET() {
  try {
    // Use fallback provider to get teams
    const espn = createESPNProvider();
    const nbaStats = createNBAStatsProvider();
    
    const provider = createFallbackProvider([espn, nbaStats], {
      fallbackOnRateLimit: true,
      fallbackOnError: true,
    });

    const teams = await provider.getAllTeams();

    // Sort alphabetically by city name
    const sortedTeams = teams.sort((a, b) => a.city.localeCompare(b.city));

    console.log('[Teams API] Fetched teams:', {
      count: sortedTeams.length,
      teams: sortedTeams.map(t => `${t.city} ${t.name}`),
    });

    return NextResponse.json({
      teams: sortedTeams,
      count: sortedTeams.length,
    });
  } catch (error) {
    console.error('[Teams API] Error fetching teams:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch teams',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}





