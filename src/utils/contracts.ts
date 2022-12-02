import axios from 'axios';
// @ts-ignore No typings for etherscan-api
import { init as etherscanInit } from 'etherscan-api';
import { Abi } from 'abitype';
import { chain } from 'wagmi';
import { CHAINS_BY_ID, ETHERSCAN_API_KEY } from './constants';

const TIMEOUT = 10_000;

const ETHERSCAN_CONFIGS = {
  [chain.mainnet.id]: {
    etherscanEndpoint: 'https://api.etherscan.io',
    apiKey: ETHERSCAN_API_KEY,
  },
  [chain.goerli.id]: {
    etherscanEndpoint: 'https://api-goerli.etherscan.io',
    apiKey: ETHERSCAN_API_KEY,
  },
};

export const getContractAbi = async (
  address: string,
  chainId: number
): Promise<Abi> => {
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
    throw new Error(`Etherscan API: ${e}`);
  }

  return response.result;
};
