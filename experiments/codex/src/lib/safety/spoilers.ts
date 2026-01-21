const normalizeTag = (value: string) => value.trim().toLowerCase();

export const SPOILER_TAG_WHITELIST = [
  "late drama",
  "tight finish",
  "momentum swings",
  "big comeback",
  "playoff-style intensity",
  "physical",
  "star duel vibe",
  "shootout feel",
  "high tempo",
  "ball movement showcase",
  "notable performance",
  "memorable sequences",
  "high-energy matchup",
  "guard-led pressure",
  "stretches of real tension",
  "offense-friendly",
  "runs both ways",
  "lead changes vibe",
  "late push",
  "shot-making showcase",
  "momentum stretch",
  "good bursts",
  "highlights over suspense",
  "one-sided",
  "low suspense",
  "background viewing",
  "skippable",
  "rookie spotlight",
  "new rotation piece",
  "rising rookie",
  "young guard impact",
  "young star leap",
  "breakout wing",
] as const;

const WHITELIST_MAP = new Map(
  SPOILER_TAG_WHITELIST.map((tag) => [normalizeTag(tag), tag]),
);

// Canonicalize common non-whitelisted phrasing into our safe whitelist.
// IMPORTANT: values must be tags that exist in SPOILER_TAG_WHITELIST.
const TAG_SYNONYMS: Record<string, string | string[]> = {
  "star duel": "star duel vibe",
  "star showdown": "star duel vibe",
  "physical matchup": "physical",
  "late-possession tension": "stretches of real tension",
  "late possession tension": "stretches of real tension",
  "high-tempo shot-making": ["high tempo", "shot-making showcase"],
  "high tempo shot-making": ["high tempo", "shot-making showcase"],
  "high-tempo": "high tempo",
  "high tempo shotmaking": ["high tempo", "shot-making showcase"],
  "fast tempo": "high tempo",
  "runs and counters": "runs both ways",
  "runs & counters": "runs both ways",
  "pressure possessions": "stretches of real tension",
  "gritty finish": "tight finish",
  "late-game shot-making": "shot-making showcase",
  "late game shot-making": "shot-making showcase",
  "multiple momentum swings": "momentum swings",
  "second-half rally": "big comeback",
  "second half rally": "big comeback",
  "big momentum swing": "momentum swings",
  "high-energy stretches": "good bursts",
  "high energy stretches": "good bursts",
  "competitive early": "high-energy matchup",
  "momentum flip": "momentum swings",
  "offensive burst": "good bursts",
  "bench spark": "good bursts",
  "pull-away late": "one-sided",
  "pull away late": "one-sided",
  "brief rally attempt": "late push",
  "swingy middle stretch": "momentum stretch",
  "physical play": "physical",
  "late separation": "one-sided",
  "rivalry energy": "high-energy matchup",
  "perimeter-heavy feel": "shootout feel",
  "perimeter heavy feel": "shootout feel",
  "one-sided control": "one-sided",
  "sustained control": "one-sided",
  "limited late tension": "low suspense",
  "largely non-competitive": "skippable",
  "largely non competitive": "skippable",
  "early surge": "good bursts",
  "breakout role": "new rotation piece",
  "young scorer pop": "young star leap",
};

export const SPOILER_BLOCKLIST = [
  /\d/, // any numeric stat or score hint
  /\b(?:won|lost|beat|beats|defeated)\b/i,
  /\b(?:overtime|double overtime|triple overtime)\b/i,
  /\bot\b/i,
  /\b(?:buzzer beater|game winner|last-second|at the horn|walk-off)\b/i,
  /\b(?:clinched|eliminated|seed|standings?|record implications?)\b/i,
  /\b(?:score|final score|margin|won by|lost by)\b/i,
];

export const isSpoilerSafeText = (text: string): boolean => {
  const value = text.trim();
  if (!value) {
    return false;
  }

  return !SPOILER_BLOCKLIST.some((pattern) => pattern.test(value));
};

type TagFilterResult = {
  safeTags: string[];
  rejectedTags: string[];
};

export const filterSpoilerSafeTags = (tags: string[]): TagFilterResult => {
  const safeTags: string[] = [];
  const rejectedTags: string[] = [];

  for (const tag of tags) {
    const normalized = normalizeTag(tag);
    if (!normalized) {
      rejectedTags.push(tag);
      continue;
    }

    const canonical = WHITELIST_MAP.get(normalized);
    if (canonical && isSpoilerSafeText(normalized)) {
      if (!safeTags.includes(canonical)) {
        safeTags.push(canonical);
      }
      continue;
    }

    const synonym = TAG_SYNONYMS[normalized];
    const synonymList = Array.isArray(synonym)
      ? synonym
      : synonym
        ? [synonym]
        : [];

    if (synonymList.length === 0) {
      rejectedTags.push(tag);
      continue;
    }

    let anyAccepted = false;
    for (const mapped of synonymList) {
      const mappedNormalized = normalizeTag(mapped);
      const mappedCanonical = WHITELIST_MAP.get(mappedNormalized);
      if (!mappedCanonical) {
        continue;
      }
      if (!isSpoilerSafeText(mappedNormalized)) {
        continue;
      }
      if (!safeTags.includes(mappedCanonical)) {
        safeTags.push(mappedCanonical);
      }
      anyAccepted = true;
    }

    if (!anyAccepted) {
      rejectedTags.push(tag);
    }
  }

  return { safeTags, rejectedTags };
};
