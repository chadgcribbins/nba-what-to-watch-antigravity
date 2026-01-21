import { filterSpoilerSafeTags } from "../safety/spoilers";
import { getWatchSuggestion, type WatchSuggestion } from "./watch-suggestion";

export type ScorecardGameInput = {
  matchup: string;
  internalScore: number; // internal only; never display directly
  rawTags: string[];
};

export type RankedScorecardGame = {
  rank: number;
  matchup: string;
  score: number;
  watchSuggestion: WatchSuggestion;
  tags: string[];
  rejectedTags: string[];
};

export function rankScorecardGames(
  games: ScorecardGameInput[],
): RankedScorecardGame[] {
  const sorted = [...games].sort((a, b) => b.internalScore - a.internalScore);

  return sorted.map((game, index) => {
    const { safeTags, rejectedTags } = filterSpoilerSafeTags(game.rawTags);
    const score = Math.max(0, Math.min(100, game.internalScore));

    return {
      rank: index + 1,
      matchup: game.matchup,
      score,
      watchSuggestion: getWatchSuggestion(score),
      tags: safeTags,
      rejectedTags,
    };
  });
}






