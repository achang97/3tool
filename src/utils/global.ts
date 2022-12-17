import { ethers } from 'ethers';

export const initGlobal = () => {
  // @ts-ignore Forcefully populating ethers field
  global.ethers = ethers;
};
