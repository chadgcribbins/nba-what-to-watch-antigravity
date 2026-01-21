import type { ScorecardGameInput } from "../scorecard";

// Source: user-provided "ChatGPT response from last night's slate".
// IMPORTANT: "internalScore" is used only for regression/testing. Do not display it in UI.
export const SCORECARD_2025_12_20: ScorecardGameInput[] = [
  {
    matchup: "Orlando at Utah",
    internalScore: 92,
    rawTags: [
      "tight finish",
      "late drama",
      "multiple momentum swings",
      "high-tempo shot-making",
    ],
  },
  {
    matchup: "Phoenix at Golden State",
    internalScore: 88,
    rawTags: [
      "playoff-style intensity",
      "physical matchup",
      "star duel",
      "late-possession tension",
    ],
  },
  {
    matchup: "Washington at Memphis",
    internalScore: 81,
    rawTags: [
      "big comeback",
      "second-half rally",
      "momentum swings",
      "high-energy stretches",
    ],
  },
  {
    matchup: "Dallas at Philadelphia",
    internalScore: 77,
    rawTags: [
      "multiple momentum swings",
      "fast tempo",
      "runs and counters",
      "late-game shot-making",
    ],
  },
  {
    matchup: "Portland at Sacramento",
    internalScore: 73,
    rawTags: [
      "late push",
      "pressure possessions",
      "memorable sequences",
      "gritty finish",
    ],
  },
  {
    matchup: "Houston at Denver",
    internalScore: 70,
    rawTags: [
      "competitive early",
      "momentum flip",
      "offensive burst",
      "stretch run control",
    ],
  },
  {
    matchup: "Boston at Toronto",
    internalScore: 57,
    rawTags: [
      "competitive early",
      "strong stretches of execution",
      "bench spark",
      "pull-away late",
    ],
  },
  {
    matchup: "Charlotte at Detroit",
    internalScore: 45,
    rawTags: [
      "brief rally attempt",
      "swingy middle stretch",
      "physical play",
      "late separation",
    ],
  },
  {
    matchup: "LA Lakers at LA Clippers",
    internalScore: 41,
    rawTags: [
      "rivalry energy",
      "perimeter-heavy feel",
      "one-sided control",
      "injury storyline",
    ],
  },
  {
    matchup: "Indiana at New Orleans",
    internalScore: 34,
    rawTags: [
      "early surge",
      "sustained control",
      "limited late tension",
      "largely non-competitive",
    ],
  },
];

export const SCORECARD_2025_12_20_DISCOVERY = [
  {
    matchup: "Portland at Sacramento",
    rawTags: ["rising rookie", "breakout role"],
  },
  {
    matchup: "Washington at Memphis",
    rawTags: ["young scorer pop", "new rotation piece"],
  },
] as const;






