import { Chain, chain } from 'wagmi';

export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? '';
export const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY ?? '';
export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ?? '';

export const CHAINS = [chain.mainnet, chain.goerli];

export const CHAINS_BY_ID = CHAINS.reduce(
  (accumulator: Record<string, Chain>, currChain: Chain) => {
    accumulator[currChain.id] = currChain;
    return accumulator;
  },
  {}
);
