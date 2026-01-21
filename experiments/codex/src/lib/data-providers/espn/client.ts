type ESPNScoreboardResponse = {
  events?: ESPNEvent[];
};

export type ESPNEvent = {
  id: string;
  date: string;
  name?: string;
  competitions?: ESPNCompetition[];
  links?: { href: string; text?: string }[];
};

export type ESPNCompetition = {
  id: string;
  status?: {
    type?: {
      name?: string;
      state?: string;
      completed?: boolean;
      description?: string;
    };
  };
  competitors?: ESPNCompetitor[];
};

export type ESPNCompetitor = {
  id: string;
  homeAway: "home" | "away";
  score?: string;
  winner?: boolean;
  team: {
    id: string;
    abbreviation?: string;
    displayName: string;
    shortDisplayName?: string;
  };
  linescores?: { value?: number }[];
};

const SCOREBOARD_BASE =
  "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard";

export const fetchScoreboard = async (
  dateKey: string,
): Promise<ESPNScoreboardResponse> => {
  const url = `${SCOREBOARD_BASE}?dates=${dateKey}`;
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`ESPN scoreboard failed: ${response.status}`);
  }

  return (await response.json()) as ESPNScoreboardResponse;
};
