export enum ResourceType {
  SmartContract = 'smartContract',
  Dune = 'dune',
}

export type Resource = {
  id: string;
  name: string;
  type: ResourceType;
  createdAt: string;
  updatedAt: string;
  data: {
    [ResourceType.SmartContract]?: SmartContractData;
    [ResourceType.Dune]?: DuneData;
  };
};

export type SmartContractData = {
  chainId: number;
  address: string;
  abi: string;
  isProxy: boolean;
  logicAddress?: string;
  logicAbi?: string;
};

export type DuneData = {
  apiKey: string;
};
