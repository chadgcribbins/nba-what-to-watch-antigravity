import { describe, expect, test } from "vitest";
import {
  applyPersonalization,
  calculateBaseScore,
  calculateDramaScoreFromMargin,
  calculateTeamPreferenceScore,
  scoreGame,
} from "./scoring";

describe("ranking scoring", () => {
  test("drama score follows margin thresholds", () => {
    expect(calculateDramaScoreFromMargin(4)).toBe(30);
    expect(calculateDramaScoreFromMargin(8)).toBe(15);
    expect(calculateDramaScoreFromMargin(15)).toBe(0);
    expect(calculateDramaScoreFromMargin(25)).toBe(0);
  });

  test("base score applies comeback bonus and blowout penalty", () => {
    const closeGame = calculateBaseScore({
      finalMargin: 4,
      matchupScore: 20,
      storylineScore: 10,
      comebackFlag: true,
    });

    expect(closeGame).toBe(70);

    const blowout = calculateBaseScore({
      finalMargin: 25,
      matchupScore: 10,
    });

    expect(blowout).toBe(0);
  });

  test("team preference score stays small and scaled by rank", () => {
    const topTeam = calculateTeamPreferenceScore(1, "light");
    const bottomTeam = calculateTeamPreferenceScore(30, "strong");

    expect(topTeam).toBeCloseTo(1, 5);
    expect(bottomTeam).toBeCloseTo(0.1, 5);
  });

  test("player bonuses require a storyline", () => {
    const noStoryline = applyPersonalization(70, {
      hasMustSee: true,
      hasGoat: true,
      hasHooper: true,
      hasStoryline: false,
    });

    expect(noStoryline.adjustments.playerPreference).toBe(0);

    const withStoryline = applyPersonalization(70, {
      hasMustSee: true,
      hasGoat: true,
      hasHooper: true,
      hasStoryline: true,
    });

    expect(withStoryline.adjustments.playerPreference).toBe(7);
  });

  test("villain penalty is reduced for elite games", () => {
    const goodGame = applyPersonalization(80, { hasVillain: true });
    const eliteGame = applyPersonalization(90, { hasVillain: true });

    expect(goodGame.adjustments.villainPenalty).toBe(-15);
    expect(eliteGame.adjustments.villainPenalty).toBe(-5);
  });

  test("final score clamps within 0-100", () => {
    const clamped = scoreGame(
      { dramaScore: 98 },
      {
        teamPreferenceScore: 3,
        hasMustSee: true,
        hasGoat: true,
        hasHooper: true,
        hasStoryline: true,
      },
    );

    expect(clamped.totalScore).toBe(100);
  });
});
