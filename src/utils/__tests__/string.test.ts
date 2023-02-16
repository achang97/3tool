import { prettifyJSON, isJSON } from '../string';

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

  describe('prettifyJSON', () => {
    it('returns stringifed JSON with spaces', () => {
      const result = prettifyJSON({ hello: 1, world: 1 });
      expect(result).toEqual(
        `
{
  "hello": 1,
  "world": 1
}
        `.trim()
      );
    });
  });
});
