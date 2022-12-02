export enum ComponentType {
  Button = 'button',
  TextInput = 'text_input',
  Select = 'select',
  Table = 'table',
}

export enum SidebarViewType {
  Inspect = 'inspect',
  Create = 'create',
}

export enum NetworkType {
  Goerli = 'goerli',
  Polygon = 'polygon',
  Mumbai = 'mumbai',
  GoerliOptimism = 'goerliOptimism',
  Optimism = 'optimism',
  Arbitrum = 'arbitrum',
  Mainnet = 'mainnet',
}

export type Network = {
  name: string;
  chainId: number;
  rpcUrl: string;
  blockExplorer: string;
  etherscanEndpoint: string;
  apiKey: string;
};

export type ContractConfig = {
  address: string;
  abi?: string;
  network: NetworkType;
};
