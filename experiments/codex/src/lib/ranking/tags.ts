import { filterSpoilerSafeTags } from "@/lib/safety/spoilers";
import type { CanonicalGame } from "@/lib/data-providers/espn/mapper";

const pickTags = (game: CanonicalGame) => {
  const tags: string[] = [];
  const margin = game.finalMargin;

  if (typeof margin === "number") {
    if (margin <= 5) {
      tags.push("late drama", "momentum swings");
    } else if (margin <= 10) {
      tags.push("tight finish", "late push");
    } else if (margin > 20) {
      tags.push("one-sided", "low suspense");
    } else {
      tags.push("momentum stretch", "good bursts");
    }
  } else {
    tags.push("high-energy matchup", "star duel vibe");
  }

  return tags;
};

export const getSpoilerSafeTags = (game: CanonicalGame) => {
  const { safeTags } = filterSpoilerSafeTags(pickTags(game));
  return safeTags;
};

export const getWatchSuggestion = (score: number) => {
  if (score >= 90) {
    return "full game";
  }
  if (score >= 70) {
    return "watch fourth quarter full";
  }
  if (score >= 55) {
    return "condensed then full late";
  }
  if (score >= 40) {
    return "condensed is enough";
  }
  return "condensed or skip";
};

export const getPreviewTags = () => [
  "high-energy matchup",
  "star duel vibe",
  "ball movement showcase",
];
