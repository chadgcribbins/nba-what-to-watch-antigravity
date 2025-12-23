// Spoiler Safety Logic

// 1. Blocklist: ABSOLUTE BANS
// These terms must never appear in any user-facing text (tags, tips, notes).
export const SPOILER_BLOCKLIST = [
    // Scores and numbers
    /\d+-\d+/, // Score pattern like 110-108
    /won by/i,
    /lost by/i,
    /margin/i,
    /score of/i,

    // Outcome phrases
    /buzzer/i,
    /game winner/i,
    /last-second/i,
    /at the horn/i,
    /walk-off/i,
    /clinched/i,
    /eliminated/i,
    /moved into/i, // standings
    /defeated/i,
    /beat/i,
    /victory/i,
    /defeat/i,

    // Overtime
    /overtime/i,
    /OT/i,
    /double OT/i,
    /extra period/i,
];

// 2. Whitelist: SAFE TAGS
// Only these phrases are allowed in the UI.
export const SAFE_TAGS = {
    DRAMA: [
        "late drama",
        "tight finish",
        "momentum swings",
        "big comeback",
        "clutch possessions",
        "pressure basketball",
        "wild swings",
        "down to the wire energy"
    ],
    MATCHUP: [
        "high stakes matchup",
        "contender matchup",
        "rivalry energy",
        "rematch vibes",
        "style clash",
        "playoff-style intensity"
    ],
    STYLE: [
        "shootout feel",
        "high tempo",
        "ball movement showcase",
        "physical game",
        "defensive battle"
    ],
    STORYLINE: [
        "notable performance",
        "memorable sequences",
        "debut or return",
        "statement night"
    ],
    LOW_SUSPENSE: [
        "low suspense",
        "one-sided stretches",
        "not much tension",
        "background watch"
    ],
    DISCOVERY: [
        "rising rookie",
        "breakout wing",
        "young star leap",
        "new rotation piece"
    ],
    PREGAME_HYPE: [
        "star-studded matchup",
        "rivalry night",
        "style clash",
        "playoff preview vibe",
        "must-watch matchup"
    ]
};

// 3. Watch Tips (Enum for deterministic mapping)
export const WATCH_TIPS = {
    SKIP: "skip",
    CONDENSED: "condensed is enough",
    WATCH_4Q: "watch 4th quarter full",
    RICH_4Q: "condensed, then watch 4th quarter full",
    FULL: "full game",
    REMIND: "set a reminder"
};

// 4. Narrative Templates (Playful Narrative Punch)
export const NARRATIVE_TEMPLATES = {
    HEAVYWEIGHT: [
        "A classic heavyweight clash in the [Division]",
        "Two giants collide with [Conference] supremacy in mind",
        "A marquee matchup that lived up to the billing",
        "Pure contender energy on display in [City]"
    ],
    CLUTCH: [
        "Energy levels are red-lining in [City]",
        "A tension-soaked battle that came down to the wire",
        "Drama. Pure, unadulterated drama.",
        "The intensity in [City] was off the charts"
    ],
    FRENETIC: [
        "A high-octane shootout that left everyone breathless",
        "Offensive fireworks and a blistering pace",
        "A track meet with a basketball problem",
        "Both teams were in an absolute rhythm tonight"
    ],
    GRIT: [
        "A physical, hard-nosed defensive masterpiece",
        "No easy buckets today—pure physical basketball",
        "A grind-it-out battle for every single possession",
        "Defensive intensity that felt like the 90s"
    ],
    STANDARD: [
        "A professional battle between [Away] and [Home]",
        "The [Away] visit the [Home] in a high-stakes meeting",
        "Standard divisional rivaly with plenty of juice",
        "Testing the mettle of both squads in [City]"
    ],
    PREGAME: [
        "Bracing for impact: [Away] vs [Home] in [City]",
        "High-stakes positioning on the line tonight",
        "All eyes on the [Division] as these two meet",
        "The stage is set for a massive clash in [City]",
        "A potential playoff preview brewing in [City]",
        "Two high-powered offenses collide tonight",
        "Can the [Home] defend their home court?",
        "A pivotal matchup for the [Conference] standings",
        "Star power on full display in [City] tonight",
        "The atmosphere in [City] is already electric",
        "A true test of character for both squads",
        "Rivalry renewed: [Away] facing the [Home]"
    ]
};

export const NARRATIVE_DETAIL_TEMPLATES = {
    STAR_TEASER: [
        "A certain [Position] is putting on a clinic tonight",
        "Keep an eye on the backcourt—they're in a special rhythm",
        "A specific star is center stage in [City]",
        "Individual brilliance is defining this matchup"
    ],
    ROOKIE_TEASER: [
        "The youth movement is taking over this one",
        "A young standout is making a serious name for themselves",
        "Fresh legs and high energy are defining the pace",
        "The next generation is on full display"
    ]
};

export function isSpoilerSafe(text: string): boolean {
    const lowerText = text.toLowerCase();
    for (const pattern of SPOILER_BLOCKLIST) {
        if (pattern instanceof RegExp) {
            if (pattern.test(text)) return false;
        } else {
            // It's a string
            if (lowerText.includes((pattern as string).toLowerCase())) return false;
        }
    }
    return true;
}

export function validateTags(tags: string[]): string[] {
    return tags.filter(t => isSpoilerSafe(t));
}
