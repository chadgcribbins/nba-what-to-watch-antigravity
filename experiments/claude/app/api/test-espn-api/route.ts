/**
 * Test ESPN's scoreboard API
 * Access at: http://localhost:3002/api/test-espn-api?date=20251220
 */

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || '20251220'; // Format: YYYYMMDD
  
  // ESPN's scoreboard API endpoint
  const url = `https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${date}`;
  
  console.log('[Test ESPN API] Fetching:', url);
  
  const headers = {
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://www.espn.com/',
    'Origin': 'https://www.espn.com',
  };
  
  try {
    const response = await fetch(url, { headers });
    
    console.log('[Test ESPN API] Response status:', response.status);
    
    if (!response.ok) {
      return NextResponse.json({
        error: 'API request failed',
        status: response.status,
        statusText: response.statusText,
        url,
      }, { status: 500 });
    }
    
    const data = await response.json();
    
    const events = data.events || [];
    const gamesCount = events.length;
    
    console.log('[Test ESPN API] Games found:', gamesCount);
    
    // Extract key info from each game
    const games = events.map((event: any) => {
      const competition = event.competitions?.[0];
      const status = competition?.status;
      
      return {
        id: event.id,
        name: event.name,
        shortName: event.shortName,
        date: event.date,
        status: {
          type: status?.type?.name,
          detail: status?.type?.detail,
          state: status?.type?.state,
          completed: status?.type?.completed,
        },
        competitors: competition?.competitors?.map((comp: any) => ({
          id: comp.id,
          team: comp.team?.displayName,
          score: comp.score,
          homeAway: comp.homeAway,
        })),
      };
    });
    
    return NextResponse.json({
      source: 'espn-scoreboard-api',
      date,
      gamesCount,
      games,
      rawSample: events[0], // First game raw data for inspection
    });
  } catch (error) {
    console.error('[Test ESPN API] Error:', error);
    return NextResponse.json({
      error: 'Request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      url,
    }, { status: 500 });
  }
}

