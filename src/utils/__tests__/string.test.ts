import { isJSON } from '../string';

describe('string', () => {
  describe('isJSON', () => {
    it('returns false for invalid JSON', () => {
      const result = isJSON('a');
      expect(result).toEqual(false);
    });

    it('returns true for valid JSON', () => {
      const result = isJSON('[]');
      expect(result).toEqual(true);
    });
  });
});
