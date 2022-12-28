import { stringToColor } from '../styles';

describe('styles', () => {
  describe('stringToColor', () => {
    it('returns correct hex value for string', () => {
      const result = stringToColor('Test');
      expect(result).toEqual('#b2b827');
    });
  });
});
