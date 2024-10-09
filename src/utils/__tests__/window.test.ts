import { createTitle } from '../window';

describe('window', () => {
  describe('createTitle', () => {
    it('appends "| 3Tool" suffix to given string', () => {
      const mockTitle = 'Title';
      const result = createTitle(mockTitle);
      expect(result).toEqual(`${mockTitle} | 3Tool`);
    });
  });
});
