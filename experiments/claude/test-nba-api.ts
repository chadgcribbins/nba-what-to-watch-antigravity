/**
 * Quick test script to check NBA Stats API response
 * Run with: npx tsx test-nba-api.ts
 */

async function testNBAStatsAPI() {
  const testDate = new Date('2025-12-20');
  const dateStr = `${String(testDate.getMonth() + 1).padStart(2, '0')}/${String(testDate.getDate()).padStart(2, '0')}/${testDate.getFullYear()}`;
  
  console.log('Testing NBA Stats API for date:', dateStr);
  
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
    
    if (!response.ok) {
      console.error('API request failed:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    
    console.log('\n=== API Response ===');
    console.log('Result Sets:', data.resultSets?.map((rs: any) => rs.name));
    
    const gameHeader = data.resultSets?.find((rs: any) => rs.name === 'GameHeader');
    if (gameHeader) {
      console.log('\n=== Games Found ===');
      console.log('Total games:', gameHeader.rowSet.length);
      
      if (gameHeader.rowSet.length > 0) {
        console.log('\nHeaders:', gameHeader.headers);
        console.log('\nFirst game data:', gameHeader.rowSet[0]);
      } else {
        console.log('\nNo games in response for this date.');
      }
    } else {
      console.log('\nNo GameHeader result set found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testNBAStatsAPI();

