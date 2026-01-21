/**
 * Spoiler Safety Validator
 *
 * Three-layer defense system to prevent spoilers from reaching users:
 * 1. Whitelist: Approved safe tags/phrases
 * 2. Blocklist: Forbidden patterns (scores, outcomes, drama keywords)
 * 3. Automated Testing: Red team test cases
 *
 * CRITICAL: This is a core value proposition. 100% test pass rate required.
 */

export type ValidationResult =
  | { valid: true }
  | { valid: false; reason: string; violatingPattern: string };

/**
 * Whitelist of approved safe tags and phrases
 * These can appear in UI-facing text without spoiling the game
 */
const SAFE_TAGS = new Set([
  // Player activity (no outcomes)
  'triple-double watch',
  'career high watch',
  'milestone watch',
  'revenge game',
  'homecoming',
  'debut',
  'return from injury',

  // Team context (no outcomes)
  'rivalry game',
  'playoff implications',
  'division matchup',
  'conference finals rematch',

  // Game characteristics (no outcomes)
  'high pace',
  'defensive battle expected',
  'star power',
  'bench depth battle',
  'coaching matchup',

  // Neutral drama signals
  'chippy',
  'physical',
  'intense',
  'competitive',
  'back-and-forth expected',
]);

/**
 * Blocklist of forbidden patterns that reveal spoilers
 * These patterns must NEVER appear in UI-facing text
 */
const FORBIDDEN_PATTERNS = [
  // Explicit scores and point totals
  /\b\d{2,3}\s*-\s*\d{2,3}\b/, // "112-108"
  /\b\d{2,3}\s+to\s+\d{2,3}\b/, // "112 to 108"
  /\bscored?\s+\d{2,3}\s+points?\b/i, // "scored 112 points"
  /\b\d{2,3}\s+points?\s+(scored|total)\b/i, // "112 points scored"

  // Winner/loser language
  /\b(won|lost|win|loss|beat|defeated|victory|defeat)\b/i,
  /\b(winner|loser|champion)\b/i,

  // Overtime mentions
  /\b(overtime|OT|2OT|3OT|double\s+overtime|triple\s+overtime)\b/i,

  // Drama outcome reveals
  /\bbuzzer\s+beater\b/i,
  /\bgame\s+winner\b/i,
  /\bgame\s+winning\b/i,
  /\bwalk-off\b/i,
  /\blast\s+second\b/i,
  /\bfinal\s+shot\b/i,
  /\bclutch\s+shot\b/i,
  /\bcomeback\b/i,
  /\bcome\s+back\b/i,
  /\bblowout\b/i,
  /\brout\b/i,
  /\bupset\b/i,

  // Lead/margin language
  /\b(lead|led|leading|ahead)\s+by\s+\d+\b/i,
  /\b\d+\s+point\s+(lead|margin)\b/i,

  // Final/result language
  /\bfinal\s+score\b/i,
  /\bfinal\s+result\b/i,
  /\bend\s+result\b/i,
  /\bhow\s+it\s+ended\b/i,

  // Quarter/half scores
  /\b(first|second|third|fourth)\s+(quarter|half)\s+score\b/i,
  /\bhalftime\s+score\b/i,
  /\bQ[1-4]\s+score\b/i,
];

/**
 * Validates that text is safe to display to users (no spoilers)
 *
 * @param text - Text to validate (tags, descriptions, metadata)
 * @param context - Optional context for better error messages
 * @returns ValidationResult indicating if text is safe
 */
export function validateSpoilerFree(
  text: string,
  context?: string
): ValidationResult {
  // Empty or whitespace-only text is safe
  if (!text || text.trim().length === 0) {
    return { valid: true };
  }

  // Check against forbidden patterns
  for (const pattern of FORBIDDEN_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return {
        valid: false,
        reason: `Contains forbidden spoiler pattern: "${match[0]}"`,
        violatingPattern: match[0],
      };
    }
  }

  // Check for numeric scores in isolation (catching edge cases)
  // Pattern: three digits in a row (likely a score)
  const isolatedNumbers = text.match(/\b\d{3}\b/g);
  if (isolatedNumbers) {
    return {
      valid: false,
      reason: `Contains suspicious numeric value: "${isolatedNumbers[0]}" (possible score)`,
      violatingPattern: isolatedNumbers[0],
    };
  }

  return { valid: true };
}

/**
 * Validates that a tag is on the approved whitelist
 *
 * @param tag - Tag string to validate
 * @returns ValidationResult indicating if tag is whitelisted
 */
export function validateTag(tag: string): ValidationResult {
  const normalized = tag.toLowerCase().trim();

  // First check if it's on the whitelist
  if (SAFE_TAGS.has(normalized)) {
    return { valid: true };
  }

  // If not whitelisted, run through spoiler check
  const spoilerCheck = validateSpoilerFree(tag, 'tag');
  if (!spoilerCheck.valid) {
    return spoilerCheck;
  }

  // Not on whitelist but also doesn't violate blocklist
  // This is a gray area - reject to be safe
  return {
    valid: false,
    reason: `Tag "${tag}" not on approved whitelist. Add to SAFE_TAGS if this should be allowed.`,
    violatingPattern: tag,
  };
}

/**
 * Batch validates multiple strings
 * Returns array of results in same order as input
 *
 * @param texts - Array of strings to validate
 * @param context - Optional context for error messages
 * @returns Array of ValidationResults
 */
export function validateBatch(
  texts: string[],
  context?: string
): ValidationResult[] {
  return texts.map((text) => validateSpoilerFree(text, context));
}

/**
 * Validates that an object's user-facing fields are spoiler-free
 * Useful for validating API responses before returning to client
 *
 * @param obj - Object to validate
 * @param fieldsToCheck - Array of field names to validate
 * @returns ValidationResult with first violation found, or valid if all pass
 */
export function validateObject(
  obj: Record<string, unknown>,
  fieldsToCheck: string[]
): ValidationResult {
  for (const field of fieldsToCheck) {
    const value = obj[field];

    if (typeof value === 'string') {
      const result = validateSpoilerFree(value, `field: ${field}`);
      if (!result.valid) {
        return result;
      }
    } else if (Array.isArray(value)) {
      // Validate each string in array
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] === 'string') {
          const result = validateSpoilerFree(
            value[i] as string,
            `field: ${field}[${i}]`
          );
          if (!result.valid) {
            return result;
          }
        }
      }
    }
  }

  return { valid: true };
}

/**
 * Red Team Test Cases
 * These should ALL fail validation (return valid: false)
 * Run these in automated tests to ensure blocklist is working
 */
export const RED_TEAM_CASES = [
  '112-108', // Explicit score
  'Warriors won 112-108', // Score with winner
  'Lakers won in overtime', // OT mention
  'Buzzer beater by LeBron', // Drama outcome
  'Steph hit the game winner', // Drama outcome
  'Celtics beat the Heat', // Winner/loser
  'Final score: 98-95', // Final + score
  'Leading by 15 points', // Lead mention
  'Comeback from 20 down', // Comeback
  'Blowout win', // Outcome + margin characterization
  'Q4 score was 28-22', // Quarter score
  'Halftime score 56-54', // Half score
  'They scored 130 points', // Point total
  'Lost by 3', // Loss + margin
  'Won in 2OT', // Win + overtime
  'Upset victory', // Upset
  'Close game that went to OT', // OT mention
  '125 points total', // Point total (suspicious)
];

/**
 * Green Team Test Cases
 * These should ALL pass validation (return valid: true)
 * Run these in automated tests to ensure we're not over-blocking
 */
export const GREEN_TEAM_CASES = [
  'triple-double watch', // Whitelisted tag
  'rivalry game', // Whitelisted tag
  'high pace', // Whitelisted tag
  'LeBron James', // Player name
  'Los Angeles Lakers', // Team name
  'Playoff implications', // Whitelisted
  'Star power matchup', // Safe description
  'Return from injury', // Whitelisted
  'Career high watch', // Whitelisted
  'Physical defensive battle expected', // Safe prediction
  'Bench depth will be key', // Safe analysis
  'Coaching matchup to watch', // Safe context
  '', // Empty string
  '   ', // Whitespace only
];
