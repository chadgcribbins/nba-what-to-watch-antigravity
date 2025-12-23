
import { format } from 'date-fns';

const API_KEY = process.env.BALLDONTLIE_API_KEY;
const BASE_URL = 'https://api.balldontlie.io/v1';

async function test() {
    console.log('Testing BallDontLie API...');

    if (!API_KEY) {
        console.error("No API KEY found in process.env");
        process.exit(1);
    }
    console.log('Key length:', API_KEY.length);

    const headers = { 'Authorization': API_KEY };

    // 1. Search for LeBron
    console.log('\n--- Searching for LeBron ---');
    try {
        const res = await fetch(`${BASE_URL}/players?first_name=LeBron`, { headers });
        console.log('Search Status:', res.status, res.statusText);

        if (res.ok) {
            const data = await res.json();
            console.log('Search Result:', JSON.stringify(data, null, 2));

            if (data.data && data.data.length > 0) {
                const player = data.data[0];
                console.log(`Found: ${player.first_name} ${player.last_name} (ID: ${player.id})`);

                // Fetch averages
                // current season is 2024 (2024-25 season)
                const statsRes = await fetch(`${BASE_URL}/season_averages?season=2024&player_ids[]=${player.id}`, { headers });
                console.log('Stats Status:', statsRes.status, statsRes.statusText);

                if (statsRes.ok) {
                    const statsData = await statsRes.json();
                    console.log('Stats Result:', JSON.stringify(statsData, null, 2));
                } else {
                    console.log('Stats Body:', await statsRes.text());
                }
            }
        } else {
            console.log('Search Text:', await res.text());
        }

    } catch (e) {
        console.error("Error:", e);
    }

    // 2. Direct fetch ID 237 (LeBron historic ID)
    console.log('\n--- Testing Direct Fetch (ID 237) ---');
    try {
        const res = await fetch(`${BASE_URL}/players/237`, { headers });
        console.log('ID Status:', res.status, res.statusText);
        if (res.ok) {
            console.log('ID Result:', JSON.stringify(await res.json(), null, 2));
        } else {
            console.log('ID Text:', await res.text());
        }
    } catch (e) {
        console.error("Error:", e)
    }
}

test();
