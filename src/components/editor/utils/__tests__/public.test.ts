import { utils } from '../public';

describe('public', () => {
  describe('openUrl', () => {
    it('opens url in new tab', () => {
      const mockUrl = 'https://google.com';
      utils.openUrl(mockUrl, { newTab: true });
      expect(window.open).toHaveBeenCalledWith(mockUrl, '_blank');
    });

    it('opens url in same tab', () => {
      const mockUrl = 'https://google.com';
      utils.openUrl(mockUrl, { newTab: false });
      expect(window.open).toHaveBeenCalledWith(mockUrl, '_self');
    });
  });
});
