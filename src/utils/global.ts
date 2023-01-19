import { ethers } from 'ethers';

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
