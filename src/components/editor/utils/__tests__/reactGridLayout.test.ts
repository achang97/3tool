import { hasLayoutMoved, hasLayoutResized } from '../reactGridLayout';

describe('reactGridLayout', () => {
  describe('hasLayoutMoved', () => {
    it('returns false if x and y coordinates are the same', () => {
      const result = hasLayoutMoved(
        { i: 'id', x: 0, y: 0, w: 0, h: 0 },
        { i: 'id', x: 0, y: 0, w: 0, h: 0 }
      );
      expect(result).toEqual(false);
    });

    it('returns true if x has changed', () => {
      const result = hasLayoutMoved(
        { i: 'id', x: 0, y: 0, w: 0, h: 0 },
        { i: 'id', x: 1, y: 0, w: 0, h: 0 }
      );
      expect(result).toEqual(true);
    });

    it('returns true if y has changed', () => {
      const result = hasLayoutMoved(
        { i: 'id', x: 0, y: 0, w: 0, h: 0 },
        { i: 'id', x: 0, y: 1, w: 0, h: 0 }
      );
      expect(result).toEqual(true);
    });
  });

  describe('hasLayoutResized', () => {
    it('returns false if w and h coordinates are the same', () => {
      const result = hasLayoutResized(
        { i: 'id', x: 0, y: 0, w: 0, h: 0 },
        { i: 'id', x: 0, y: 0, w: 0, h: 0 }
      );
      expect(result).toEqual(false);
    });

    it('returns true if w has changed', () => {
      const result = hasLayoutResized(
        { i: 'id', x: 0, y: 0, w: 0, h: 0 },
        { i: 'id', x: 1, y: 0, w: 1, h: 0 }
      );
      expect(result).toEqual(true);
    });

    it('returns true if h has changed', () => {
      const result = hasLayoutResized(
        { i: 'id', x: 0, y: 0, w: 0, h: 0 },
        { i: 'id', x: 0, y: 1, w: 0, h: 1 }
      );
      expect(result).toEqual(true);
    });
  });
});
