
const FORBIDDEN_PATTERNS = [
    /\d+-\d+/g,      // 102-101
    /\d+\s+to\s+\d+/gi, // 102 to 101
    /final/gi,
    /overtime/gi,
    / ot /gi,
    / double ot /gi,
    / 2ot /gi,
    / won /gi,
    / lost /gi,
    / defeat /gi,
    / blowout /gi,
    / buzzer beater /gi, // Sometimes reveals a close finish too much
];

/**
 * Scrubs any potential spoiler terms from a string.
 */
export function safetyScrub(text: string): string {
    let scrubbed = text;

    FORBIDDEN_PATTERNS.forEach(pattern => {
        scrubbed = scrubbed.replace(pattern, '[REDACTED]');
    });

    // Cleanup double redactions or spaces
    return scrubbed.replace(/\[REDACTED\](\s*\[REDACTED\])+/g, '[REDACTED]').trim();
}
