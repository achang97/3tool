import { isInBounds } from 'utils/window';

describe('window', () => {
  describe('isInBounds', () => {
    it('returns true if x and y are in bounds', () => {
      const result = isInBounds(4, 14, {
        left: 2,
        right: 10,
        top: 12,
        bottom: 20,
      } as DOMRect);
      expect(result).toEqual(true);
    });

    it('returns false if x is too far left', () => {
      const result = isInBounds(1, 14, {
        left: 2,
        right: 10,
        top: 12,
        bottom: 20,
      } as DOMRect);
      expect(result).toEqual(false);
    });

    it('returns false if x is too far right', () => {
      const result = isInBounds(11, 14, {
        left: 2,
        right: 10,
        top: 12,
        bottom: 20,
      } as DOMRect);
      expect(result).toEqual(false);
    });

    it('returns false if y is too far up', () => {
      const result = isInBounds(4, 11, {
        left: 2,
        right: 10,
        top: 12,
        bottom: 20,
      } as DOMRect);
      expect(result).toEqual(false);
    });

    it('returns false if y is too far down', () => {
      const result = isInBounds(4, 21, {
        left: 2,
        right: 10,
        top: 12,
        bottom: 20,
      } as DOMRect);
      expect(result).toEqual(false);
    });
  });
});
