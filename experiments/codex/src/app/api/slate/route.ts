import { fetchScoreboard } from "@/lib/data-providers/espn/client";
import { mapEspnEvent } from "@/lib/data-providers/espn/mapper";
import { scoreGame } from "@/lib/ranking/scoring";
import { getPreviewTags, getSpoilerSafeTags, getWatchSuggestion } from "@/lib/ranking/tags";
import { formatDateKey, getSlateWindow } from "@/lib/time/slate";

export const runtime = "nodejs";

type RankedGame = {
  rank: number;
  gameId: string;
  matchup: string;
  tags: string[];
  watchSuggestion: string;
  watchLink?: string;
};

type UpcomingGame = {
  gameId: string;
  matchup: string;
  tipTime: string;
  previewTags: string[];
  pick: string;
};

const getDateKeysForWindow = (start: Date, end: Date, timeZone: string) => {
  const startKey = formatDateKey(start, timeZone);
  const endKey = formatDateKey(end, timeZone);
  return startKey === endKey ? [startKey] : [startKey, endKey];
};

const computeComeback = (linescores?: { home: number[]; away: number[] }) => {
  if (!linescores || linescores.home.length < 3 || linescores.away.length < 3) {
    return false;
  }
  const homeThrough3 = linescores.home.slice(0, 3).reduce((a, b) => a + b, 0);
  const awayThrough3 = linescores.away.slice(0, 3).reduce((a, b) => a + b, 0);
  const homeFinal = linescores.home.reduce((a, b) => a + b, 0);
  const awayFinal = linescores.away.reduce((a, b) => a + b, 0);

  return (
    (homeThrough3 < awayThrough3 && homeFinal > awayFinal) ||
    (awayThrough3 < homeThrough3 && awayFinal > homeFinal)
  );
};

export const GET = async (request: Request) => {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const timeZone = searchParams.get("tz") ?? "UTC";

  const window = getSlateWindow({ date, timeZone });
  const dateKeys = getDateKeysForWindow(window.start, window.end, timeZone);

  const responses = await Promise.all(
    dateKeys.map(async (key) => fetchScoreboard(key)),
  );

  const events = responses.flatMap((data) => data.events ?? []);
  const mapped = events
    .map(mapEspnEvent)
    .filter((game): game is NonNullable<typeof game> => Boolean(game));

  const windowGames = mapped.filter((game) => {
    const startTime = new Date(game.startTime);
    return startTime >= window.start && startTime < window.end;
  });

  const finalGames = windowGames.filter((game) => game.status === "final");
  const upcomingGames = windowGames.filter((game) => game.status !== "final");

  const ranked = finalGames
    .map((game) => {
      const breakdown = scoreGame({
        finalMargin: game.finalMargin,
        comebackFlag: computeComeback(game.linescores),
      });
      return {
        game,
        score: breakdown.totalScore,
        tags: getSpoilerSafeTags(game),
        watchSuggestion: getWatchSuggestion(breakdown.totalScore),
      };
    })
    .sort((a, b) => b.score - a.score);

  const rankedGames: RankedGame[] = ranked.map((item, index) => ({
    rank: index + 1,
    gameId: item.game.id,
    matchup: `${item.game.awayTeam.name} at ${item.game.homeTeam.name}`,
    tags: item.tags,
    watchSuggestion: item.watchSuggestion,
    watchLink: item.game.watchLink,
  }));

  const upcoming: UpcomingGame[] = upcomingGames.map((game) => ({
    gameId: game.id,
    matchup: `${game.awayTeam.name} at ${game.homeTeam.name}`,
    tipTime: game.startTime,
    previewTags: getPreviewTags(),
    pick: `${game.homeTeam.name} (home lean)`,
  }));

  return Response.json({
    meta: {
      generatedAt: new Date().toISOString(),
      timezone: timeZone,
      slateWindow: {
        start: window.start.toISOString(),
        end: window.end.toISOString(),
        label: window.label,
      },
      gamesCount: rankedGames.length,
    },
    rankedGames,
    upcomingGames: upcoming,
  });
};
