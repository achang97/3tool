import { ethers } from 'ethers';
import axios from 'axios';
// @ts-ignore No typings for etherscan-api
import { init as etherscanInit } from 'etherscan-api';
import { NetworkType } from 'types';
import { NETWORKS } from './constants';

const ETHERSCAN_TIMEOUT = 10_000;

export const validateAbi = (abi: unknown): boolean =>
  Array.isArray(abi) && abi.length > 0;

export const validateAddress = (address: string): boolean =>
  ethers.utils.isAddress(address);

export const validateContract = async (
  address: string,
  provider: ethers.providers.Provider
): Promise<boolean> => {
  const bytecode = await provider.getCode(address);
  return bytecode !== '0x';
};

export const loadContractEtherscan = async (
  address: string,
  network: NetworkType,
  userSignerOrProvider: ethers.Signer | ethers.providers.Provider
): Promise<ethers.Contract> => {
  if (!ethers.utils.isAddress(address)) {
    throw new Error('Invalid Contract Address');
  }

  if (!NETWORKS[network]?.etherscanEndpoint) {
    throw new Error('Invalid Network');
  }

  const client = axios.create({
    baseURL: NETWORKS[network]?.etherscanEndpoint,
    timeout: ETHERSCAN_TIMEOUT,
  });
  const etherscanClient = etherscanInit(
    NETWORKS[network].apiKey,
    network,
    ETHERSCAN_TIMEOUT,
    client
  );

  let response;
  try {
    response = await etherscanClient.contract.getabi(address);
  } catch (e) {
    throw new Error(`Etherscan API: ${e}`);
  }

  if (response.status !== '1') {
    throw new Error(
      "Can't fetch data from Etherscan. Ensure the contract is verified."
    );
  }

  const abi = response.result;

  return new ethers.Contract(address, abi, userSignerOrProvider);
};

export const loadContractRaw = async (
  address: string,
  abi: string,
  network: NetworkType,
  userSignerOrProvider: ethers.Signer | ethers.providers.Provider
): Promise<ethers.Contract> => {
  if (!validateAddress(address)) {
    throw new Error('Invalid Contract Address');
  }

  const provider =
    userSignerOrProvider instanceof ethers.Signer
      ? userSignerOrProvider.provider
      : userSignerOrProvider;
  const bytecode = await provider?.getCode(address);
  if (!bytecode || bytecode === '0x') {
    throw new Error(
      `There is no Contract Deployed at that address on ${network}`
    );
  }

  try {
    if (!validateAbi(JSON.parse(abi))) {
      throw new Error('Invalid Contract ABI');
    }
  } catch (e) {
    // JSON parse error
    throw new Error('Invalid Contract ABI');
  }

  return new ethers.Contract(address, abi, userSignerOrProvider);
};
