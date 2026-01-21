import { describe, expect, test } from "vitest";
import {
  filterSpoilerSafeTags,
  isSpoilerSafeText,
} from "./spoilers";

describe("spoiler safety", () => {
  test("accepts whitelisted tags", () => {
    const result = filterSpoilerSafeTags(["late drama", "momentum swings"]);
    expect(result.safeTags).toEqual(["late drama", "momentum swings"]);
    expect(result.rejectedTags).toEqual([]);
  });

  test("normalizes tags before validating", () => {
    const result = filterSpoilerSafeTags([" Late Drama "]);
    expect(result.safeTags).toEqual(["late drama"]);
    expect(result.rejectedTags).toEqual([]);
  });

  test("rejects non-whitelisted tags", () => {
    const result = filterSpoilerSafeTags(["epic thriller"]);
    expect(result.safeTags).toEqual([]);
    expect(result.rejectedTags).toEqual(["epic thriller"]);
  });

  test("rejects blocked phrases", () => {
    expect(isSpoilerSafeText("buzzer beater")).toBe(false);
    expect(isSpoilerSafeText("overtime drama")).toBe(false);
  });

  test("rejects numeric hints", () => {
    expect(isSpoilerSafeText("won by 3")).toBe(false);
    expect(isSpoilerSafeText("110-108")).toBe(false);
  });

  test("canonicalizes common synonym tags into the whitelist", () => {
    const result = filterSpoilerSafeTags([
      "Star duel",
      "high-tempo shot-making",
      "late-possession tension",
      "runs and counters",
    ]);

    expect(result.safeTags).toEqual([
      "star duel vibe",
      "high tempo",
      "shot-making showcase",
      "stretches of real tension",
      "runs both ways",
    ]);
    expect(result.rejectedTags).toEqual([]);
  });

  test("rejects score-like strings even if they look like tags", () => {
    const result = filterSpoilerSafeTags(["Score: 92", "tight finish"]);
    expect(result.safeTags).toEqual(["tight finish"]);
    expect(result.rejectedTags).toEqual(["Score: 92"]);
  });
});
