import axios from 'axios';
import { init as etherscanInit } from 'etherscan-api';
import { Abi } from 'abitype';
import { CHAINS_BY_ID, CHAIN_EXPLORER_URLS_BY_ID, CHAIN_APIS_BY_ID } from '@app/constants';

const TIMEOUT = 10_000;

export const getTransactionUrl = (chainId: number, transactionHash: string): string => {
  const baseUrl = CHAIN_EXPLORER_URLS_BY_ID[chainId];
  if (!baseUrl) {
    return '';
  }
  return `${baseUrl}/tx/${transactionHash}`;
};

export const getContractAbi = async (address: string, chainId: number): Promise<Abi> => {
  if (!Object.keys(CHAIN_APIS_BY_ID).includes(chainId.toString())) {
    throw new Error(`Invalid chainId ${chainId}`);
  }

  const config = CHAIN_APIS_BY_ID[chainId as keyof typeof CHAIN_APIS_BY_ID];

  const client = axios.create({
    baseURL: config.apiUrl,
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
