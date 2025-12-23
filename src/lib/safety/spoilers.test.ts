import { describe, it, expect } from 'vitest';
import { isSpoilerSafe, validateTags } from './spoilers';

describe('Spoiler Safety', () => {
    it('blocks scores', () => {
        expect(isSpoilerSafe('Final score 110-108')).toBe(false);
        expect(isSpoilerSafe('won by 5')).toBe(false);
    });

    it('blocks outcome phrases', () => {
        expect(isSpoilerSafe('Buzzer beater win!')).toBe(false);
        expect(isSpoilerSafe('Game winner at the horn')).toBe(false);
        expect(isSpoilerSafe('Clinched playoff spot')).toBe(false);
    });

    it('blocks overtime mentions', () => {
        expect(isSpoilerSafe('Heading to OT')).toBe(false);
        expect(isSpoilerSafe('Double Overtime Thriller')).toBe(false);
    });

    it('allows safe phrases', () => {
        expect(isSpoilerSafe('Late drama')).toBe(true);
        expect(isSpoilerSafe('Tight finish')).toBe(true);
        expect(isSpoilerSafe('Playoff-style intensity')).toBe(true);
    });

    it('validates tag lists', () => {
        const input = ['Late drama', '110-100', 'Buzzer beater', 'Physical defense'];
        const output = validateTags(input);
        expect(output).toEqual(['Late drama', 'Physical defense']);
    });
});
