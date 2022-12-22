import { lineClamp } from '../mui';

describe('mui', () => {
  describe('lineClamp', () => {
    it('returns SxProps object with correct number of lines', () => {
      const mockNumLines = 2;
      const result = lineClamp(mockNumLines);
      expect(result).toEqual({
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: mockNumLines,
        WebkitBoxOrient: 'vertical',
      });
    });
  });
});
