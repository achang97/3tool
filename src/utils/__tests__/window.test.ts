import { createTitle } from '../window';

describe('window', () => {
  describe('createTitle', () => {
    it('appends "| ACA Labs" suffix to given string', () => {
      const mockTitle = 'Title';
      const result = createTitle(mockTitle);
      expect(result).toEqual(`${mockTitle} | ACA Labs`);
    });
  });
});
