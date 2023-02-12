import { getTitle } from '../window';

describe('window', () => {
  describe('getTitle', () => {
    it('appends "| ACA Labs" suffix to given string', () => {
      const mockTitle = 'Title';
      const result = getTitle(mockTitle);
      expect(result).toEqual(`${mockTitle} | ACA Labs`);
    });
  });
});
