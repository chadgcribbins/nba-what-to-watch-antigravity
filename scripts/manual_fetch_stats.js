
const fs = require('fs');
const path = require('path');

const url = 'https://stats.nba.com/stats/leaguedashplayerstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&LastNGames=0&LeagueID=00&Location=&MeasureType=Base&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=0&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2025-26&SeasonSegment=&SeasonType=Regular+Season&ShotClockRange=&StarterBench=&TeamID=0&VsConference=&VsDivision=';

const headers = {
    'Referer': 'https://www.nba.com/',
    'Origin': 'https://www.nba.com',
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
};

async function fetchStats() {
    console.log('Fetching fresh stats from NBA.com...');
    try {
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(`NBA API error: ${response.status}`);

        const data = await response.json();
        const resultSet = data.resultSets ? data.resultSets[0] : data.resultSet;
        const headersList = resultSet.headers;
        const rows = resultSet.rowSet;

        const idx = (name) => headersList.indexOf(name);
        const pId = idx('PLAYER_ID');
        const pPts = idx('PTS');
        const pReb = idx('REB');
        const pAst = idx('AST');
        const pStl = idx('STL');
        const pBlk = idx('BLK');
        const p3pm = idx('FG3M');
        const p3pct = idx('FG3_PCT');
        const pFgPct = idx('FG_PCT');
        const pFtPct = idx('FT_PCT');
        const pTov = idx('TOV');
        const pMin = idx('MIN');

        const statsMap = {};

        rows.forEach((row) => {
            const playerId = String(row[pId] ?? '');
            if (!playerId) return;

            statsMap[playerId] = {
                pts: Number(row[pPts] ?? 0),
                reb: Number(row[pReb] ?? 0),
                ast: Number(row[pAst] ?? 0),
                stl: Number(row[pStl] ?? 0),
                blk: Number(row[pBlk] ?? 0),
                three_pm: Number(row[p3pm] ?? 0),
                three_pct: parseFloat((Number(row[p3pct] ?? 0) * 100).toFixed(1)),
                fg_pct: parseFloat((Number(row[pFgPct] ?? 0) * 100).toFixed(1)),
                ft_pct: parseFloat((Number(row[pFtPct] ?? 0) * 100).toFixed(1)),
                tov: Number(row[pTov] ?? 0),
                min: Number(row[pMin] ?? 0),
            };
        });

        const CACHE_DIR = path.join(process.cwd(), '.cache');
        const CACHE_FILE = path.join(CACHE_DIR, 'nba_league_leaders.json');
        if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);
        fs.writeFileSync(CACHE_FILE, JSON.stringify(statsMap, null, 2));
        console.log(`Success! Saved ${Object.keys(statsMap).length} players.`);
    } catch (e) {
        console.error('Fetch failed:', e);
    }
}

fetchStats();
