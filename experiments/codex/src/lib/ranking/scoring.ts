export type TeamWeight = "light" | "medium" | "strong";

export type BaseScoreSignals = {
  finalMargin?: number | null;
  dramaScore?: number;
  matchupScore?: number;
  storylineScore?: number;
  blowoutFlag?: boolean;
  comebackFlag?: boolean;
};

export type PersonalizationInputs = {
  teamPreferenceScore?: number;
  hasMustSee?: boolean;
  hasHooper?: boolean;
  hasVillain?: boolean;
  hasGoat?: boolean;
  hasStoryline?: boolean;
};

export type ScoreAdjustments = {
  teamPreference: number;
  playerPreference: number;
  villainPenalty: number;
};

export type ScoreSignals = BaseScoreSignals & {
  hasStoryline?: boolean;
};

export type ScoringBreakdown = {
  baseScore: number;
  totalScore: number;
  adjustments: ScoreAdjustments;
};

const TEAM_WEIGHT_POINTS: Record<TeamWeight, number> = {
  light: 1,
  medium: 2,
  strong: 3,
};

const MUST_SEE_BONUS = 3;
const GOAT_BONUS = 3;
const HOOPER_BONUS = 1;
const VILLAIN_PENALTY_STANDARD = 15;
const VILLAIN_PENALTY_REDUCED = 5;
const VILLAIN_EXCEPTION_THRESHOLD = 85;
const BLOWOUT_PENALTY = 20;
const COMEBACK_BONUS = 10;

export const clampScore = (value: number): number =>
  Math.max(0, Math.min(100, value));

export const calculateDramaScoreFromMargin = (
  finalMargin?: number | null,
): number => {
  if (finalMargin == null) {
    return 0;
  }

  if (finalMargin <= 5) {
    return 30;
  }

  if (finalMargin <= 10) {
    return 15;
  }

  return 0;
};

export const calculateBaseScore = (signals: BaseScoreSignals): number => {
  const usesMargin = signals.dramaScore == null;
  const dramaScore =
    signals.dramaScore ?? calculateDramaScoreFromMargin(signals.finalMargin);
  const comebackBonus =
    usesMargin && signals.comebackFlag ? COMEBACK_BONUS : 0;
  const matchupScore = signals.matchupScore ?? 0;
  const storylineScore = signals.storylineScore ?? 0;
  const blowoutPenalty =
    signals.blowoutFlag || (signals.finalMargin ?? 0) > 20
      ? BLOWOUT_PENALTY
      : 0;

  return clampScore(
    dramaScore + comebackBonus + matchupScore + storylineScore - blowoutPenalty,
  );
};

export const calculateTeamPreferenceScore = (
  teamRank: number,
  weight: TeamWeight,
): number => {
  const clampedRank = Math.max(1, Math.min(30, teamRank));
  const normalized = (31 - clampedRank) / 30;

  return normalized * TEAM_WEIGHT_POINTS[weight];
};

export const applyPersonalization = (
  baseScore: number,
  inputs: PersonalizationInputs = {},
): { score: number; adjustments: ScoreAdjustments } => {
  const teamPreference = inputs.teamPreferenceScore ?? 0;
  const hasStoryline = inputs.hasStoryline ?? false;
  let playerPreference = 0;

  if (hasStoryline && inputs.hasMustSee) {
    playerPreference += MUST_SEE_BONUS;
  }

  if (hasStoryline && inputs.hasGoat) {
    playerPreference += GOAT_BONUS;
  }

  if (hasStoryline && inputs.hasHooper) {
    playerPreference += HOOPER_BONUS;
  }

  const villainPenalty = inputs.hasVillain
    ? baseScore > VILLAIN_EXCEPTION_THRESHOLD
      ? -VILLAIN_PENALTY_REDUCED
      : -VILLAIN_PENALTY_STANDARD
    : 0;

  const score = clampScore(
    baseScore + teamPreference + playerPreference + villainPenalty,
  );

  return {
    score,
    adjustments: { teamPreference, playerPreference, villainPenalty },
  };
};

export const scoreGame = (
  signals: BaseScoreSignals,
  personalization?: PersonalizationInputs,
): ScoringBreakdown => {
  const baseScore = calculateBaseScore(signals);
  const { score, adjustments } = applyPersonalization(
    baseScore,
    personalization,
  );

  return { baseScore, totalScore: score, adjustments };
};
