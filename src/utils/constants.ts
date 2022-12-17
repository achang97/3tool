import { Chain, mainnet, goerli } from 'wagmi';

export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? '';

export const WALLETCONNECT_PROJECT_ID =
  process.env.WALLETCONNECT_PROJECT_ID ?? '';

export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN ?? '';
export const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID ?? '';

export const CHAINS = [mainnet, goerli];

export const CHAINS_BY_ID = CHAINS.reduce(
  (accumulator: Record<string, Chain>, currChain: Chain) => {
    accumulator[currChain.id] = currChain;
    return accumulator;
  },
  {}
);
