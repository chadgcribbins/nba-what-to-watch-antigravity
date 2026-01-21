import type { ESPNCompetition, ESPNEvent } from "./client";

export type CanonicalTeam = {
  id: string;
  name: string;
  abbreviation: string;
};

export type CanonicalGame = {
  id: string;
  startTime: string;
  status: "final" | "scheduled" | "in_progress";
  homeTeam: CanonicalTeam;
  awayTeam: CanonicalTeam;
  homeScore?: number;
  awayScore?: number;
  finalMargin?: number;
  linescores?: {
    home: number[];
    away: number[];
  };
  watchLink?: string;
};

const parseScore = (score?: string) =>
  score == null ? undefined : Number(score);

const parseLinescores = (competition: ESPNCompetition | undefined) => {
  if (!competition?.competitors) {
    return undefined;
  }
  const home = competition.competitors.find(
    (team) => team.homeAway === "home",
  );
  const away = competition.competitors.find(
    (team) => team.homeAway === "away",
  );
  if (!home?.linescores || !away?.linescores) {
    return undefined;
  }

  const homeScores = home.linescores
    .map((line) => line.value)
    .filter((value): value is number => typeof value === "number");
  const awayScores = away.linescores
    .map((line) => line.value)
    .filter((value): value is number => typeof value === "number");

  if (homeScores.length === 0 || awayScores.length === 0) {
    return undefined;
  }

  return { home: homeScores, away: awayScores };
};

const deriveStatus = (competition: ESPNCompetition | undefined) => {
  const status = competition?.status?.type;
  if (status?.completed || status?.name === "STATUS_FINAL") {
    return "final";
  }
  if (status?.state === "in") {
    return "in_progress";
  }
  return "scheduled";
};

export const mapEspnEvent = (event: ESPNEvent): CanonicalGame | null => {
  const competition = event.competitions?.[0];
  const competitors = competition?.competitors;
  if (!competition || !competitors) {
    return null;
  }

  const home = competitors.find((team) => team.homeAway === "home");
  const away = competitors.find((team) => team.homeAway === "away");
  if (!home || !away) {
    return null;
  }

  const homeScore = parseScore(home.score);
  const awayScore = parseScore(away.score);
  const finalMargin =
    typeof homeScore === "number" && typeof awayScore === "number"
      ? Math.abs(homeScore - awayScore)
      : undefined;

  const linescores = parseLinescores(competition);

  return {
    id: event.id,
    startTime: event.date,
    status: deriveStatus(competition),
    homeTeam: {
      id: home.team.id,
      name: home.team.displayName,
      abbreviation:
        home.team.abbreviation ?? home.team.shortDisplayName ?? "HOME",
    },
    awayTeam: {
      id: away.team.id,
      name: away.team.displayName,
      abbreviation:
        away.team.abbreviation ?? away.team.shortDisplayName ?? "AWAY",
    },
    homeScore,
    awayScore,
    finalMargin,
    linescores,
    watchLink: event.links?.[0]?.href,
  };
};
