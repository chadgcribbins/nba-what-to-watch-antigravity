import fs from 'fs';
import path from 'path';

export interface PlayerStats {
    pts: number;
    reb: number;
    ast: number;
    stl: number;
    blk: number;
    three_pm: number;
    fg: number; // percentage
    to: number; // turnovers
    min: number;
}

const CACHE_DIR = path.join(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'nba_league_leaders.json');
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

export async function getLeagueLeaders(): Promise<Record<string, PlayerStats>> {
    // 1. Check Cache
    if (fs.existsSync(CACHE_FILE)) {
        const stats = fs.statSync(CACHE_FILE);
        const now = new Date().getTime();
        if (now - stats.mtimeMs < CACHE_TTL) {
            try {
                return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
            } catch (e) {
                console.error('Failed to parse stats cache', e);
            }
        }
    }

    // 2. Fetch from NBA.com
    console.log('Fetching fresh stats from NBA.com...');
    const url = 'https://stats.nba.com/stats/leagueleaders?LeagueID=00&PerMode=PerGame&Scope=S&Season=2025-26&SeasonType=Regular+Season&StatCategory=PTS';

    const headers = {
        'Referer': 'https://www.nba.com/',
        'Origin': 'https://www.nba.com',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
    };

    try {
        const response = await fetch(url, { headers });
        if (!response.ok) throw new Error(`NBA API error: ${response.status}`);

        const data = await response.json();
        const resultSet = data.resultSet;
        const headersList = resultSet.headers as string[];
        const rows = resultSet.rowSet as unknown[][];

        // Map column indices
        const idx = (name: string) => headersList.indexOf(name);
        const pId = idx('PLAYER_ID');
        const pPts = idx('PTS');
        const pReb = idx('REB');
        const pAst = idx('AST');
        const pStl = idx('STL');
        const pBlk = idx('BLK');
        const p3pm = idx('FG3M');
        const pFgPct = idx('FG_PCT');
        const pTov = idx('TOV');
        const pMin = idx('MIN');

        const statsMap: Record<string, PlayerStats> = {};

        rows.forEach((row) => {
            const playerId = String(row[pId] ?? '');
            statsMap[playerId] = {
                pts: Number(row[pPts] ?? 0),
                reb: Number(row[pReb] ?? 0),
                ast: Number(row[pAst] ?? 0),
                stl: Number(row[pStl] ?? 0),
                blk: Number(row[pBlk] ?? 0),
                three_pm: Number(row[p3pm] ?? 0),
                fg: Number(row[pFgPct] ?? 0) * 100, // Convert to 0-100 scale
                to: Number(row[pTov] ?? 0),
                min: Number(row[pMin] ?? 0),
            };
        });

        // 3. Update Cache
        if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR);
        fs.writeFileSync(CACHE_FILE, JSON.stringify(statsMap, null, 2));

        return statsMap;
    } catch (error) {
        console.error('Failed to fetch from NBA.com', error);
        throw error;
    }
}
