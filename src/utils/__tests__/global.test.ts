import { ethers } from 'ethers';
import fetch from 'node-fetch';
import AbortController from 'abort-controller';
import { initFetch, initGlobal } from '../global';

describe('global', () => {
  describe('initGlobal', () => {
    it('sets fields within global variable', () => {
      // @ts-ignore globalThis has no typing
      expect(global.ethers).toEqual(undefined);

      initGlobal();

      // @ts-ignore globalThis has no typing
      expect(global.ethers).toEqual(ethers);
    });
  });

  describe('initFetch', () => {
    it('sets fetch and AbortController', () => {
      initFetch();

      expect(global.fetch).toEqual(fetch);
      expect(global.AbortController).toEqual(AbortController);
    });
  });
});
