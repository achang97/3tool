import { ethers } from 'ethers';
import { initGlobal } from '../global';

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
});
