import { mainnet, goerli } from 'wagmi';
import _ from 'lodash';

export const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY ?? '';

export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

export const CHAINS = [mainnet, goerli];
export const CHAIN_IDS_BY_NAME = _.mapValues({ mainnet, goerli }, 'id');
export const CHAINS_BY_ID = _.keyBy(CHAINS, 'id');
