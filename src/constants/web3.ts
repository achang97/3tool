import { mainnet, goerli, sepolia, polygon, polygonMumbai } from 'wagmi/chains';
import _ from 'lodash';

export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? '';

export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

const CHAIN_MAP = {
  mainnet,
  goerli,
  sepolia,
  polygon,
  polygonMumbai,
};

export const CHAINS = Object.values(CHAIN_MAP);
export const CHAIN_IDS_BY_NAME = _.mapValues(CHAIN_MAP, 'id');
export const CHAINS_BY_ID = _.mapKeys(CHAIN_MAP, 'id');
export const CHAIN_EXPLORER_URLS_BY_ID = _.mapValues(CHAINS_BY_ID, 'blockExplorers.default.url');
