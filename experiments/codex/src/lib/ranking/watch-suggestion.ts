export type WatchSuggestion =
  | "full_game"
  | "watch_4q_full"
  | "condensed_enough";

// Per PRD:
// - full_game: score 90+
// - watch_4q_full: score 70-89
// - condensed_enough: all others
export function getWatchSuggestion(score: number): WatchSuggestion {
  if (score >= 90) return "full_game";
  if (score >= 70) return "watch_4q_full";
  return "condensed_enough";
}






