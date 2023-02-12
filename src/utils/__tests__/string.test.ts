import { isJSON, replaceTokensAtIndices } from '../string';

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

  describe('replaceTokensAtIndices', () => {
    it('replaces original tokens with replacement tokens at the specified indices', () => {
      const result = replaceTokensAtIndices(
        '{{ button1.text }} button1 {{ textInput.value }}',
        ['button1', 'value'],
        ['button2', 'defaultValue'],
        [3, 40]
      );
      expect(result).toEqual(
        '{{ button2.text }} button1 {{ textInput.defaultValue }}'
      );
    });
  });
});
