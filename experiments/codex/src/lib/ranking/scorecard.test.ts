import { describe, expect, test } from "vitest";
import { filterSpoilerSafeTags } from "../safety/spoilers";
import {
  SCORECARD_2025_12_20,
  SCORECARD_2025_12_20_DISCOVERY,
} from "./fixtures/scorecard-2025-12-20";
import { rankScorecardGames } from "./scorecard";

describe("scorecard regression fixture", () => {
  test("ranks games by internal score descending and assigns watchSuggestion buckets", () => {
    const ranked = rankScorecardGames(SCORECARD_2025_12_20);

    expect(ranked.map((g) => g.matchup)).toEqual([
      "Orlando at Utah",
      "Phoenix at Golden State",
      "Washington at Memphis",
      "Dallas at Philadelphia",
      "Portland at Sacramento",
      "Houston at Denver",
      "Boston at Toronto",
      "Charlotte at Detroit",
      "LA Lakers at LA Clippers",
      "Indiana at New Orleans",
    ]);

    // PRD thresholds:
    // - full_game: 90+
    // - watch_4q_full: 70-89
    // - condensed_enough: all others
    expect(ranked[0].watchSuggestion).toBe("full_game"); // 92
    expect(ranked[1].watchSuggestion).toBe("watch_4q_full"); // 88
    expect(ranked[5].watchSuggestion).toBe("watch_4q_full"); // 70
    expect(ranked[6].watchSuggestion).toBe("condensed_enough"); // 57
    expect(ranked[9].watchSuggestion).toBe("condensed_enough"); // 34
  });

  test("produces only spoiler-safe whitelist tags (no scores/winners) for scorecard tags", () => {
    const ranked = rankScorecardGames(SCORECARD_2025_12_20);

    for (const game of ranked) {
      // We don't require all raw tags to map, but we do require at least one safe tag.
      expect(game.tags.length).toBeGreaterThan(0);

      // And every emitted tag must be accepted by the validator.
      const validation = filterSpoilerSafeTags(game.tags);
      expect(validation.rejectedTags).toEqual([]);
      expect(validation.safeTags).toEqual(game.tags);
    }
  });

  test("discovery tags remain spoiler-safe and avoid player names by staying in whitelist", () => {
    const filtered = SCORECARD_2025_12_20_DISCOVERY.map((item) => ({
      matchup: item.matchup,
      ...filterSpoilerSafeTags(item.rawTags),
    }));

    for (const item of filtered) {
      expect(item.safeTags.length).toBeGreaterThan(0);
      expect(item.rejectedTags).toEqual([]);
    }
  });
});






