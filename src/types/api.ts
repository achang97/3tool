import { User } from '@auth0/auth0-react';

export type ApiError = {
  status: number;
  data: {
    message: string;
  } | null;
};

export type Tool = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  creator: User;
};

export type SmartContract = {
  chainId: number;
  address: string;
  abi: string;
  isProxy: boolean;
  logicAddress?: string;
  logicAbi?: string;
};

export type Resource = {
  id: string;
  name: string;
  type: 'smart_contract' | 'dune';
  createdAt: string;
  updatedAt: string;
  numLinkedQueries: number;
  metadata: {
    smartContract?: SmartContract;
    dune?: {
      apiKey: string;
    };
  };
};
