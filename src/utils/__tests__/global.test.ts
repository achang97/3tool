import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import { initFetch } from '../global';

describe('global', () => {
  describe('initFetch', () => {
    it('sets fetch and AbortController', () => {
      initFetch();

      expect(global.fetch).toEqual(fetch);
      expect(global.AbortController).toEqual(AbortController);
    });
  });
});
