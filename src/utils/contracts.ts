import axios from 'axios';
import { init as etherscanInit } from 'etherscan-api';
import { Abi } from 'abitype';
import { mainnet, goerli } from 'wagmi';
import { CHAINS_BY_ID, ETHERSCAN_API_KEY } from '@app/constants';

const TIMEOUT = 10_000;

export const ETHERSCAN_CONFIGS: Record<
  number,
  {
    etherscanEndpoint: string;
    apiKey: string;
  }
> = {
  [mainnet.id]: {
    etherscanEndpoint: 'https://api.etherscan.io',
    apiKey: ETHERSCAN_API_KEY,
  },
  [goerli.id]: {
    etherscanEndpoint: 'https://api-goerli.etherscan.io',
    apiKey: ETHERSCAN_API_KEY,
  },
};

export const getContractAbi = async (address: string, chainId: number): Promise<Abi> => {
  const config = ETHERSCAN_CONFIGS[chainId];

  if (!config) {
    throw new Error(`Invalid chainId ${chainId}`);
  }

  const client = axios.create({
    baseURL: config.etherscanEndpoint,
    timeout: TIMEOUT,
  });
  const etherscanClient = etherscanInit(
    config.apiKey,
    CHAINS_BY_ID[chainId].network,
    TIMEOUT,
    client
  );

  let response;
  try {
    response = await etherscanClient.contract.getabi(address);
  } catch (e) {
    throw new Error(e as string);
  }

  return JSON.parse(response.result);
};
