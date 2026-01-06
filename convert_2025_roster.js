const fs = require('fs');

try {
    const raw = fs.readFileSync('roster_2025.json', 'utf8');
    const data = eval('(' + raw + ')');

    const players = [];
    const seenIds = new Set();

    data.players.forEach(p => {
        // Filter for NBA teams (0-29)
        if (typeof p.tid === 'number' && p.tid >= 0 && p.tid <= 29) {

            // Validate Headshot URL - RELAXED CHECK
            if (p.imgURL && p.imgURL.includes('nba.com') && p.imgURL.includes('headshots')) {
                const match = p.imgURL.match(/\/(\d+)\.png$/);

                // Construct Name (Handle split firstName/lastName or combined name)
                const fullName = p.name || ((p.firstName && p.lastName) ? `${p.firstName} ${p.lastName}` : null);

                if (match && fullName) {
                    const nbaId = match[1];
                    const name = fullName;

                    if (!seenIds.has(nbaId)) {
                        seenIds.add(nbaId);

                        // Extract Stats
                        let latestStats = null;
                        if (p.stats && p.stats.length > 0) {
                            latestStats = p.stats[p.stats.length - 1];
                        }

                        const minutes = latestStats ? latestStats.min : 0;
                        const starts = latestStats ? latestStats.gs : 0;
                        const gp = latestStats ? latestStats.gp : 0;

                        let isStarter = false;
                        if (gp > 0) {
                            isStarter = (starts >= (gp / 2));
                        }

                        // PATCHES
                        let teamId = p.tid + 1;
                        let forceStarter = isStarter;
                        let forceMinutes = minutes;

                        if (name === 'Kevin Durant') {
                            teamId = 11; // Rockets
                            forceStarter = true;
                            forceMinutes = 2500;
                        }

                        const gp_val = gp || 1;
                        players.push({
                            id: nbaId,
                            name: name,
                            teamId: teamId,
                            headshotUrl: p.imgURL,
                            isStarter: forceStarter,
                            minutes: forceMinutes,
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
        }
    });

    // MANUAL INJECTIONS for missing stars
    // Jabari Smith Jr. (Missing from source)
    players.push({
        id: "1631095",
        name: "Jabari Smith Jr.",
        teamId: 11, // Rockets
        headshotUrl: "https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/1631095.png",
        isStarter: true,
        minutes: 2400,
        jerseyNumber: "10",
        points: 13.7,
        rebounds: 8.1,
        assists: 1.6,
        steals: 0.7,
        blocks: 0.8,
        fgPct: 45.4,
        threePtPct: 36.3,
        ftPct: 82.2,
        usage: 18.2
    });

    // Sort by Minutes DESC
    players.sort((a, b) => b.minutes - a.minutes);

    console.log(`Extracted ${players.length} players from 2025 roster.`);

    const content = `// Auto-generated from BBGM 2025-26 Roster
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

export const ALL_PLAYERS: PlayerStar[] = ${JSON.stringify(players, null, 4)};
`;

    fs.writeFileSync('src/lib/data/allPlayers.ts', content);
    console.log('Successfully wrote to src/lib/data/allPlayers.ts');

} catch (e) {
    console.error("Error processing:", e);
}
