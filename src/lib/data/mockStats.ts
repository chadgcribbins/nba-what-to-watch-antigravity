
import { ALL_PLAYERS } from './allPlayers';

export interface PlayerStats {
    pts: number;
    reb: number;
    ast: number;
    stl: number;
    blk: number;
    three_pm: number;
    fg_pct: number;
    three_pct: number;
    ft_pct: number;
    tov: number;
    min: number;
}

// Helper to generate vaguely realistic stats based on archetype
function generateStats(player: typeof ALL_PLAYERS[0]): PlayerStats {
    // Deterministic random based on ID to keep it stable
    const seed = parseInt(player.id) || player.name.length;
    const rand = () => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    };

    const isStar = player.minutes > 2400; // ~30mpg
    const isBig = player.name.includes("Jokic") || player.name.includes("Embiid") || player.name.includes("Davis") || player.name.includes("Gobert") || player.name.includes("Sabonis");
    const isGuard = player.name.includes("Curry") || player.name.includes("Doncic") || player.name.includes("Young") || player.name.includes("Harden") || player.name.includes("Lillard") || player.name.includes("Edwards");

    let pts = 10 + (player.minutes / 100);
    let reb = 4 + (player.minutes / 500);
    let ast = 2 + (player.minutes / 600);
    let stl = 0.5 + (Math.random() * 1.5);
    let blk = 0.3 + (Math.random() * 1.0);
    let three_pm = 1.0 + (Math.random() * 2.0);

    // Archetype adjustments
    if (isStar) {
        pts += 10;
        if (isBig) { reb += 6; blk += 1.5; three_pm = 0.5; } // Bigs don't shoot 3s usually (except Towns/Jokic)
        if (isGuard) { ast += 5; pts += 5; stl += 0.5; three_pm += 1.5; }
    }

    // Specific Overrides for "Realism" (The user wants leaders)
    if (player.name.includes("Doncic")) { pts = 34.1; ast = 9.8; reb = 9.0; three_pm = 3.9; }
    if (player.name.includes("Jokic")) { pts = 29.4; ast = 10.7; reb = 12.1; three_pm = 1.6; }
    if (player.name.includes("Embiid")) { pts = 31.0; reb = 11.5; blk = 2.0; three_pm = 1.2; }
    if (player.name.includes("Giannis")) { pts = 30.5; reb = 11.0; three_pm = 0.4; }
    if (player.name.includes("Shai")) { pts = 32.5; stl = 2.2; three_pm = 1.8; }
    if (player.name.includes("Curry")) { pts = 28.0; three_pm = 4.9; } // The Chef
    if (player.name.includes("Tatum")) { pts = 27.5; reb = 8.5; three_pm = 3.2; }
    if (player.name.includes("Lillard")) { pts = 26.0; three_pm = 3.8; }
    if (player.name.includes("Harden")) { ast = 8.5; three_pm = 2.9; }
    if (player.name.includes("Wembanyama")) { blk = 3.5; three_pm = 1.9; }

    return {
        pts: parseFloat(pts.toFixed(1)),
        reb: parseFloat(reb.toFixed(1)),
        ast: parseFloat(ast.toFixed(1)),
        stl: parseFloat(stl.toFixed(1)),
        blk: parseFloat(blk.toFixed(1)),
        three_pm: parseFloat(three_pm.toFixed(1)),
        fg_pct: parseFloat((42 + (rand() * 15)).toFixed(1)),
        three_pct: parseFloat((28 + (rand() * 15)).toFixed(1)),
        ft_pct: parseFloat((65 + (rand() * 25)).toFixed(1)),
        tov: parseFloat((1 + (rand() * 3)).toFixed(1)),
        min: parseFloat((player.minutes / 82).toFixed(1)) // Approx MPG
    };
}

export const MOCK_STATS: Record<string, PlayerStats> = {};

ALL_PLAYERS.forEach(p => {
    MOCK_STATS[p.id] = generateStats(p);
});
