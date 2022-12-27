import { Abi } from 'abitype';

export type ContractConfig = {
  address: string;
  abi: Abi;
  chainId: number;
};
