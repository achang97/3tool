import { ethers } from 'ethers';
import AbortController from 'abort-controller';
import fetch from 'node-fetch';

export const GLOBAL_LIBRARIES = [
  { label: 'ethers', library: ethers },
  { label: 'web3' }, // Included in pages/_document.tsx
];

export const initGlobal = () => {
  GLOBAL_LIBRARIES.forEach(({ label, library }) => {
    if (library) {
      // @ts-ignore Forcefully populating global fields
      global[label] = library;
    }
  });
};

export const initFetch = () => {
  Object.assign(globalThis, {
    fetch,
    AbortController,
  });
};
