import { NextRequest, NextResponse } from 'next/server';

interface NbaNextData {
    props?: {
        pageProps?: {
            gameCardFeed?: {
                modules?: NbaGameCardModule[];
            };
        };
    };
}

interface NbaGameCardModule {
    moduleType?: string;
    cards?: NbaGameCard[];
}

interface NbaGameCard {
    cardData?: {
        gameId?: string;
        homeTeam?: { teamName?: string; teamTricode?: string };
        awayTeam?: { teamName?: string; teamTricode?: string };
    };
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const source = searchParams.get('source') || 'espn';
    const dateStr = searchParams.get('dates'); // YYYYMMDD

    if (!dateStr) {
        return NextResponse.json({ error: 'Missing dates parameter' }, { status: 400 });
    }

    if (source === 'nba') {
        // SCRAPING FALLBACK: The JSON endpoint is 403 Forbidden.
        // We fetch the HTML page and extract __NEXT_DATA__
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const htmlUrl = `https://www.nba.com/games?date=${year}-${month}-${day}`;

        try {
            const res = await fetch(htmlUrl, {
                cache: 'no-store',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Accept': 'text/html',
                }
            });

            if (!res.ok) {
                return NextResponse.json({ error: `NBA Scraping failed: ${res.statusText}` }, { status: res.status });
            }

            const html = await res.text();
            const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);

            if (!nextDataMatch) {
                return NextResponse.json({ error: 'Could not find __NEXT_DATA__' }, { status: 500 });
            }

            const nextData = JSON.parse(nextDataMatch[1]) as NbaNextData;

            // Extract simplified scoreboard-like structure
            const modules = nextData.props?.pageProps?.gameCardFeed?.modules ?? [];
            const gamesModule = modules.find((m) => m.moduleType === 'list');

            if (!gamesModule) {
                return NextResponse.json({ scoreboard: { games: [] } });
            }

            const games = (gamesModule.cards ?? []).map((c) => ({
                gameId: c.cardData?.gameId,
                homeTeam: {
                    teamName: c.cardData?.homeTeam?.teamName,
                    teamTricode: c.cardData?.homeTeam?.teamTricode,
                },
                awayTeam: {
                    teamName: c.cardData?.awayTeam?.teamName,
                    teamTricode: c.cardData?.awayTeam?.teamTricode,
                },
            }));

            return NextResponse.json({ scoreboard: { games } });
        } catch (e) {
            console.error('[NBA Scraper] Failed:', e);
            return NextResponse.json({ error: 'Failed to scrape NBA.com' }, { status: 500 });
        }
    }

    // Default: ESPN Proxy
    const url = `https://site.web.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard?dates=${dateStr}`;

    try {
        const res = await fetch(url, { cache: 'no-store' });
        if (!res.ok) {
            return NextResponse.json({ error: `Source API error: ${res.statusText}` }, { status: res.status });
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (e) {
        console.error('[API Proxy] Fetch failed:', e);
        return NextResponse.json({ error: `Failed to fetch from ${source}` }, { status: 500 });
    }
}
