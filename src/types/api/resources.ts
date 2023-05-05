import { Action } from './tools';

export enum ResourceType {
  SmartContract = 'smartContract',
  Abi = 'abi',
}

export type Resource = {
  _id: string;
  name: string;
  type: ResourceType;
  createdAt: string;
  updatedAt: string;
  data: {
    [ResourceType.SmartContract]?: SmartContractData;
    [ResourceType.Abi]?: AbiData;
  };
};

export type ResourceWithLinkedActions = Resource & {
  linkedActions?: LinkedAction[];
};

export type SmartContractData = {
  chainId: number;
  address: string;
  abiId: string;
};

export type AbiData = {
  isProxy: boolean;
  abi: string;
  logicAbi?: string;
};

export type LinkedAction = Action & {
  toolName: string;
  toolId: string;
};
