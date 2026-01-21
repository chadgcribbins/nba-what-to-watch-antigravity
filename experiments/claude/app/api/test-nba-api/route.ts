/**
 * Test API route to check NBA Stats API response
 * Access at: http://localhost:3002/api/test-nba-api?date=2025-12-20
 */

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateParam = searchParams.get('date') || '2025-12-20';
  
  const testDate = new Date(dateParam);
  const dateStr = `${String(testDate.getMonth() + 1).padStart(2, '0')}/${String(testDate.getDate()).padStart(2, '0')}/${testDate.getFullYear()}`;
  
  console.log('[Test] Querying NBA Stats API for date:', dateStr);
  
  const url = `https://stats.nba.com/stats/scoreboardv2?GameDate=${dateStr}&LeagueID=00&DayOffset=0`;
  
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
    const response = await fetch(url, { headers });
    
    console.log('[Test] Response status:', response.status, response.statusText);
    
    if (!response.ok) {
      return NextResponse.json({
        error: 'API request failed',
        status: response.status,
        statusText: response.statusText,
      }, { status: 500 });
    }
    
    const data = await response.json();
    
    const gameHeader = data.resultSets?.find((rs: any) => rs.name === 'GameHeader');
    const gamesCount = gameHeader?.rowSet?.length || 0;
    
    console.log('[Test] Games found:', gamesCount);
    if (gameHeader && gamesCount > 0) {
      console.log('[Test] First game:', gameHeader.rowSet[0]);
    }
    
    return NextResponse.json({
      dateQueried: dateStr,
      resultSets: data.resultSets?.map((rs: any) => ({ name: rs.name, rowCount: rs.rowSet?.length })),
      gamesCount,
      gameHeaders: gameHeader?.headers,
      games: gameHeader?.rowSet || [],
    });
  } catch (error) {
    console.error('[Test] Error:', error);
    return NextResponse.json({
      error: 'Request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

