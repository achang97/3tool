export type Resource = {
  id: string;
  name: string;
  type: ResourceType;
  createdAt: string;
  updatedAt: string;
  numLinkedQueries: number;
  data: {
    smartContract?: SmartContract;
    dune?: Dune;
  };
};

export enum ResourceType {
  SmartContract = 'smartContract',
  Dune = 'dune',
}

export type SmartContract = {
  chainId: number;
  address: string;
  abi: string;
  isProxy: boolean;
  logicAddress?: string;
  logicAbi?: string;
};

export type Dune = {
  apiKey: string;
};
