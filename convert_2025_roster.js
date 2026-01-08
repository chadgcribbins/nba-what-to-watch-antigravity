const fs = require('fs');
const path = require('path');

try {
    const rawRoster = fs.readFileSync('roster_2025.json', 'utf8');
    const rosterData = JSON.parse(rawRoster);

    // Load real-time stats if available
    const CACHE_FILE = path.join(process.cwd(), '.cache', 'nba_league_leaders.json');
    let realTimeStats = {};
    if (fs.existsSync(CACHE_FILE)) {
        try {
            realTimeStats = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
            console.log(`Loaded real-time stats for ${Object.keys(realTimeStats).length} players.`);
        } catch (e) {
            console.error('Failed to parse stats cache', e);
        }
    } else {
        console.warn('No real-time stats cache found at .cache/nba_league_leaders.json. Using roster defaults.');
    }

    const playerMap = new Map();

    function addOrUpdatePlayer(p) {
        if (!p.id) return;

        // Merge strategy:
        // Use BBGM roster for base info (team, headshot, minutes if missing stats)
        // Use realTimeStats for actual season averages if available

        const existing = playerMap.get(p.id) || {};
        const stats = realTimeStats[p.id];

        const merged = {
            ...existing,
            ...p, // Base info from roster
        };

        if (stats) {
            // Overlay real-time stats
            merged.points = stats.pts;
            merged.rebounds = stats.reb;
            merged.assists = stats.ast;
            // Note: nbaseStats doesn't provide 3PA directly, but we can stick to what we have or fix the interface
            // Actually, nbaStats.ts calculates 3PM. Let's look at what we have in the cache.
            // Based on nbaStats.ts: pts, reb, ast, stl, blk, three_pm, fg, to, min, three_pct, ft_pct
            // We'll use what's available and fallback to roster
            merged.points = parseFloat(stats.pts.toFixed(1));
            merged.rebounds = parseFloat(stats.reb.toFixed(1));
            merged.assists = parseFloat(stats.ast.toFixed(1));
            merged.steals = parseFloat(stats.stl.toFixed(1));
            merged.blocks = parseFloat(stats.blk.toFixed(1));
            merged.fgPct = parseFloat(stats.fg.toFixed(1));
            merged.threePtPct = stats.three_pct !== undefined ? parseFloat(stats.three_pct.toFixed(1)) : merged.threePtPct;
            merged.ftPct = stats.ft_pct !== undefined ? parseFloat(stats.ft_pct.toFixed(1)) : merged.ftPct;
            merged.turnovers = stats.tov !== undefined ? stats.tov : (merged.turnovers || 0);
            merged.usage = stats.usg || (merged.usage || 0);
            merged.minutes = stats.min || (merged.minutes || 0);


        }

        // PATCHES / OVERRIDES
        if (merged.name === 'Kevin Durant') {
            merged.teamId = 11; // Rockets
            merged.isStarter = true;
        }

        playerMap.set(p.id, merged);
    }

    rosterData.players.forEach(p => {
        // Filter for NBA teams (0-29)
        if (typeof p.tid === 'number' && p.tid >= 0 && p.tid <= 29) {
            if (p.imgURL && p.imgURL.includes('headshots')) {
                const match = p.imgURL.match(/\/(\d+)\.png$/);
                const fullName = p.name || ((p.firstName && p.lastName) ? `${p.firstName} ${p.lastName}` : null);

                if (match && fullName) {
                    const nbaId = match[1];
                    const latestStats = (p.stats && p.stats.length > 0) ? p.stats[p.stats.length - 1] : null;
                    const gp = latestStats ? latestStats.gp : 1;
                    const gp_val = gp || 1;

                    addOrUpdatePlayer({
                        id: nbaId,
                        name: fullName,
                        teamId: p.tid + 1,
                        headshotUrl: p.imgURL,
                        isStarter: latestStats ? (latestStats.gs >= (gp / 2)) : false,
                        minutes: latestStats ? latestStats.min : 0,
                        jerseyNumber: latestStats ? (latestStats.jerseyNumber || "00") : "00",
                        points: latestStats ? parseFloat((latestStats.pts / gp_val).toFixed(1)) : 0,
                        rebounds: latestStats ? parseFloat(((latestStats.drb + latestStats.orb) / gp_val).toFixed(1)) : 0,
                        assists: latestStats ? parseFloat((latestStats.ast / gp_val).toFixed(1)) : 0,
                        steals: latestStats ? parseFloat((latestStats.stl / gp_val).toFixed(1)) : 0,
                        blocks: latestStats ? parseFloat((latestStats.blk / gp_val).toFixed(1)) : 0,
                        fgPct: latestStats ? parseFloat(((latestStats.fg / (latestStats.fga || 1)) * 100).toFixed(1)) : 0,
                        threePtPct: latestStats ? parseFloat(((latestStats.tp / (latestStats.tpa || 1)) * 100).toFixed(1)) : 0,
                        ftPct: latestStats ? parseFloat(((latestStats.ft / (latestStats.fta || 1)) * 100).toFixed(1)) : 0,
                        usage: latestStats ? parseFloat(latestStats.usgp.toFixed(1)) : 0
                    });
                }
            }
        }
    });

    // Final sorting and export
    const finalPlayers = Array.from(playerMap.values());
    finalPlayers.sort((a, b) => b.minutes - a.minutes);

    console.log(`Processed ${finalPlayers.length} unique players.`);

    const content = `// Auto-generated from BBGM 2025-26 Roster & NBA Stats Cache
export interface PlayerStar {
    id: string;
    name: string;
    teamId: number;
    headshotUrl: string;
    isStarter: boolean;
    minutes: number;
    jerseyNumber: string;
    points?: number;
    rebounds?: number;
    assists?: number;
    steals?: number;
    blocks?: number;
    fgPct?: number;
    threePtPct?: number;
    ftPct?: number;
    usage?: number;
}

export const ALL_PLAYERS: PlayerStar[] = ${JSON.stringify(finalPlayers, null, 4)};\n`;

    fs.writeFileSync('src/lib/data/allPlayers.ts', content);
    console.log('Successfully wrote to src/lib/data/allPlayers.ts');

} catch (e) {
    console.error("Error processing:", e);
}
