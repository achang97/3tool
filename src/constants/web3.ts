import { Chain, mainnet, goerli } from 'wagmi';

export const ETHERSCAN_API_KEY =
  process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? '';

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

export const CHAINS = [mainnet, goerli];

export const CHAINS_BY_ID = CHAINS.reduce(
  (accumulator: Record<string, Chain>, currChain: Chain) => {
    accumulator[currChain.id] = currChain;
    return accumulator;
  },
  {}
);
