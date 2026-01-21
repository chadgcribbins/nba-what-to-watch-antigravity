/**
 * Spoiler Safety Validator Tests
 *
 * CRITICAL: 100% test pass rate required before any launch.
 * These tests ensure we never leak spoilers to users.
 */

import { describe, it, expect } from 'vitest';
import {
  validateSpoilerFree,
  validateTag,
  validateBatch,
  validateObject,
  RED_TEAM_CASES,
  GREEN_TEAM_CASES,
} from './validator';

describe('Spoiler Safety Validator', () => {
  describe('Red Team Cases (must ALL fail validation)', () => {
    RED_TEAM_CASES.forEach((testCase) => {
      it(`should REJECT: "${testCase}"`, () => {
        const result = validateSpoilerFree(testCase);
        expect(result.valid).toBe(false);
        if (!result.valid) {
          expect(result.reason).toBeTruthy();
          expect(result.violatingPattern).toBeTruthy();
        }
      });
    });

    it('should have at least 15 red team cases', () => {
      expect(RED_TEAM_CASES.length).toBeGreaterThanOrEqual(15);
    });
  });

  describe('Green Team Cases (must ALL pass validation)', () => {
    GREEN_TEAM_CASES.forEach((testCase) => {
      it(`should ACCEPT: "${testCase}"`, () => {
        const result = validateSpoilerFree(testCase);
        expect(result.valid).toBe(true);
      });
    });

    it('should have at least 10 green team cases', () => {
      expect(GREEN_TEAM_CASES.length).toBeGreaterThanOrEqual(10);
    });
  });

  describe('Score Detection', () => {
    it('should reject explicit scores with dash', () => {
      const cases = ['112-108', '95-92', '130-125'];
      cases.forEach((score) => {
        const result = validateSpoilerFree(score);
        expect(result.valid).toBe(false);
      });
    });

    it('should reject scores with "to"', () => {
      const result = validateSpoilerFree('Lakers won 112 to 108');
      expect(result.valid).toBe(false);
    });

    it('should reject point totals', () => {
      const cases = [
        'scored 112 points',
        '45 points scored',
        'They scored 130 points',
      ];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('Winner/Loser Detection', () => {
    it('should reject winner language', () => {
      const cases = [
        'Lakers won',
        'Warriors beat the Heat',
        'Celtics victory',
        'Defeated the Nets',
      ];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(false);
      });
    });

    it('should reject loser language', () => {
      const cases = ['Lakers lost', 'Lost by 3', 'Suffered a defeat'];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('Overtime Detection', () => {
    it('should reject overtime mentions', () => {
      const cases = [
        'Went to overtime',
        'OT thriller',
        'Double overtime',
        '2OT game',
        'Won in 3OT',
      ];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('Drama Outcome Detection', () => {
    it('should reject buzzer beater language', () => {
      const cases = [
        'Buzzer beater by LeBron',
        'Game winner at the buzzer',
        'Last second shot',
      ];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(false);
      });
    });

    it('should reject comeback language', () => {
      const cases = ['Comeback from 20 down', 'Epic come back'];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(false);
      });
    });

    it('should reject blowout language', () => {
      const cases = ['Blowout win', 'Total rout'];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('Safe Content Detection', () => {
    it('should accept player names', () => {
      const cases = [
        'LeBron James',
        'Stephen Curry',
        'Giannis Antetokounmpo',
      ];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(true);
      });
    });

    it('should accept team names', () => {
      const cases = [
        'Los Angeles Lakers',
        'Golden State Warriors',
        'Boston Celtics',
      ];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(true);
      });
    });

    it('should accept neutral predictions', () => {
      const cases = [
        'High pace expected',
        'Defensive battle anticipated',
        'Star power matchup',
      ];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(true);
      });
    });

    it('should accept whitelisted drama descriptors', () => {
      const cases = [
        'tight finish',
        'late drama',
        'momentum swings',
        'playoff-style intensity',
      ];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe('Tag Validation', () => {
    it('should accept whitelisted tags', () => {
      const safeTags = [
        'triple-double watch',
        'rivalry game',
        'high pace',
        'star power',
      ];
      safeTags.forEach((tag) => {
        const result = validateTag(tag);
        expect(result.valid).toBe(true);
      });
    });

    it('should reject non-whitelisted tags even if spoiler-free', () => {
      const result = validateTag('some random tag');
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.reason).toContain('not on approved whitelist');
      }
    });

    it('should reject tags with spoilers', () => {
      const result = validateTag('Won 112-108');
      expect(result.valid).toBe(false);
    });

    it('should be case-insensitive for whitelisted tags', () => {
      const result = validateTag('RIVALRY GAME');
      expect(result.valid).toBe(true);
    });
  });

  describe('Batch Validation', () => {
    it('should validate multiple strings', () => {
      const texts = [
        'LeBron James',
        'triple-double watch',
        'high pace',
        'Lakers won 112-108', // This one should fail
      ];
      const results = validateBatch(texts);

      expect(results).toHaveLength(4);
      expect(results[0].valid).toBe(true);
      expect(results[1].valid).toBe(true);
      expect(results[2].valid).toBe(true);
      expect(results[3].valid).toBe(false);
    });

    it('should handle empty array', () => {
      const results = validateBatch([]);
      expect(results).toHaveLength(0);
    });
  });

  describe('Object Validation', () => {
    it('should validate specified fields in object', () => {
      const obj = {
        title: 'Lakers vs Warriors',
        description: 'high pace rivalry game',
        score: '112-108', // Not checked
      };

      const result = validateObject(obj, ['title', 'description']);
      expect(result.valid).toBe(true);
    });

    it('should detect spoilers in object fields', () => {
      const obj = {
        title: 'Lakers beat Warriors 112-108',
        description: 'Great game',
      };

      const result = validateObject(obj, ['title', 'description']);
      expect(result.valid).toBe(false);
    });

    it('should validate array fields', () => {
      const obj = {
        tags: ['triple-double watch', 'high pace', 'Lakers won'], // Last one fails
      };

      const result = validateObject(obj, ['tags']);
      expect(result.valid).toBe(false);
    });

    it('should handle non-string fields gracefully', () => {
      const obj = {
        id: 123,
        count: 45,
        title: 'Safe title',
      };

      const result = validateObject(obj, ['id', 'count', 'title']);
      expect(result.valid).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strings', () => {
      const result = validateSpoilerFree('');
      expect(result.valid).toBe(true);
    });

    it('should handle whitespace-only strings', () => {
      const result = validateSpoilerFree('   ');
      expect(result.valid).toBe(true);
    });

    it('should handle special characters', () => {
      const result = validateSpoilerFree('Lakers @ Warriors');
      expect(result.valid).toBe(true);
    });

    it('should reject suspicious three-digit numbers', () => {
      const result = validateSpoilerFree('Total was 125');
      expect(result.valid).toBe(false);
    });

    it('should allow two-digit numbers (jersey numbers, etc.)', () => {
      const result = validateSpoilerFree('Number 23 LeBron James');
      expect(result.valid).toBe(true);
    });
  });

  describe('Context Parameter', () => {
    it('should accept optional context parameter', () => {
      const result = validateSpoilerFree('Lakers won', 'game title');
      expect(result.valid).toBe(false);
      // Context doesn't change validation, just helps with error messages
    });
  });

  describe('Coverage - Final Score Patterns', () => {
    it('should reject final score language', () => {
      const cases = [
        'Final score: 98-95',
        'Final result was close',
        'End result favored Lakers',
      ];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(false);
      });
    });
  });

  describe('Coverage - Lead/Margin Language', () => {
    it('should reject lead mentions', () => {
      const cases = ['Leading by 15', 'Led by 20 points', 'Ahead by 10'];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(false);
      });
    });

    it('should reject margin language', () => {
      const cases = ['15 point lead', '20 point margin'];
      cases.forEach((text) => {
        const result = validateSpoilerFree(text);
        expect(result.valid).toBe(false);
      });
    });
  });
});
