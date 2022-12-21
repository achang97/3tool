import { Chain, mainnet, goerli } from 'wagmi';

export const ETHERSCAN_API_KEY =
  process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? '';

export const WALLETCONNECT_PROJECT_ID =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

export const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN ?? '';
export const AUTH0_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID ?? '';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

export const MSW_API =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_MSW_API === 'true';

export const CHAINS = [mainnet, goerli];

export const CHAINS_BY_ID = CHAINS.reduce(
  (accumulator: Record<string, Chain>, currChain: Chain) => {
    accumulator[currChain.id] = currChain;
    return accumulator;
  },
  {}
);
