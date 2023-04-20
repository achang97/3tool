import {
  mainnet,
  goerli,
  sepolia,
  polygon,
  polygonMumbai,
  optimism,
  arbitrum,
  fantom,
  avalanche,
  bsc,
} from 'wagmi/chains';
import _ from 'lodash';

export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? '';
export const OPTIMISTIC_ETHERSCAN_API_KEY =
  process.env.NEXT_PUBLIC_OPTIMISTIC_ETHERSCAN_API_KEY ?? '';
export const ARBISCAN_API_KEY = process.env.NEXT_PUBLIC_ARBISCAN_API_KEY ?? '';
export const BSCSCAN_API_KEY = process.env.NEXT_PUBLIC_BSCSCAN_API_KEY ?? '';
export const POLYGONSCAN_API_KEY = process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY ?? '';
export const FTMSCAN_API_KEY = process.env.NEXT_PUBLIC_FTMSCAN_API_KEY ?? '';
export const SNOWTRACE_API_KEY = process.env.NEXT_PUBLIC_SNOWTRACE_API_KEY ?? '';

export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

const CHAIN_MAP = {
  mainnet,
  goerli,
  sepolia,
  bsc,
  polygon,
  polygonMumbai,
  optimism,
  arbitrum,
  fantom,
  avalanche,
};

export const CHAIN_APIS_BY_ID: Record<
  ValueOf<typeof CHAIN_MAP>['id'],
  {
    apiUrl: string;
    apiKey: string;
  }
> = {
  [mainnet.id]: {
    apiUrl: 'https://api.etherscan.io',
    apiKey: ETHERSCAN_API_KEY,
  },
  [goerli.id]: {
    apiUrl: 'https://api-goerli.etherscan.io',
    apiKey: ETHERSCAN_API_KEY,
  },
  [sepolia.id]: {
    apiUrl: 'https://api-sepolia.etherscan.io',
    apiKey: ETHERSCAN_API_KEY,
  },
  [bsc.id]: {
    apiUrl: 'https://api.bscscan.com',
    apiKey: BSCSCAN_API_KEY,
  },
  [polygon.id]: {
    apiUrl: 'https://api.polygonscan.com',
    apiKey: POLYGONSCAN_API_KEY,
  },
  [polygonMumbai.id]: {
    apiUrl: 'https://api-mumbai.polygonscan.com',
    apiKey: POLYGONSCAN_API_KEY,
  },
  [optimism.id]: {
    apiUrl: 'https://api-optimistic.etherscan.io',
    apiKey: OPTIMISTIC_ETHERSCAN_API_KEY,
  },
  [arbitrum.id]: {
    apiUrl: 'https://api.arbiscan.io',
    apiKey: ARBISCAN_API_KEY,
  },
  [fantom.id]: {
    apiUrl: 'https://api.ftmscan.com',
    apiKey: FTMSCAN_API_KEY,
  },
  [avalanche.id]: {
    apiUrl: 'https://api.snowtrace.io',
    apiKey: SNOWTRACE_API_KEY,
  },
};

export const CHAINS = Object.values(CHAIN_MAP);
export const CHAIN_IDS_BY_NAME = _.mapValues(CHAIN_MAP, 'id');
export const CHAINS_BY_ID = _.mapKeys(CHAIN_MAP, 'id');
export const CHAIN_EXPLORER_URLS_BY_ID = _.mapValues(CHAINS_BY_ID, 'blockExplorers.default.url');
