/**
 * Test NBA.com's actual API endpoints
 * Access at: http://localhost:3002/api/test-nbacom-api?date=2025-12-20
 */

import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || '12/20/2025';
  
  // Try the core API endpoint (what nba.com actually uses)
  const coreApiUrl = `https://core-api.nba.com/cp/api/v1.9/feeds/gamecardfeed?gamedate=${encodeURIComponent(date)}&platform=web`;
  
  console.log('[Test NBA.com API] Fetching:', coreApiUrl);
  
  const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Origin': 'https://www.nba.com',
    'Referer': 'https://www.nba.com/',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Sec-Fetch-Site': 'same-site',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Dest': 'empty',
  };
  
  try {
    const response = await fetch(coreApiUrl, { headers });
    
    console.log('[Test NBA.com API] Response status:', response.status);
    
    if (!response.ok) {
      return NextResponse.json({
        error: 'API request failed',
        status: response.status,
        statusText: response.statusText,
        url: coreApiUrl,
      }, { status: 500 });
    }
    
    const data = await response.json();
    
    console.log('[Test NBA.com API] Success! Keys:', Object.keys(data));
    
    return NextResponse.json({
      source: 'nba.com-core-api',
      date,
      data,
    });
  } catch (error) {
    console.error('[Test NBA.com API] Error:', error);
    return NextResponse.json({
      error: 'Request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      url: coreApiUrl,
    }, { status: 500 });
  }
}

