import { Network, NetworkType } from 'types';

export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY ?? '';
export const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY ?? '';
export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY ?? '';

export const NETWORKS: Record<NetworkType, Network> = {
  mainnet: {
    name: 'mainnet',
    chainId: 1,
    rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    blockExplorer: 'https://etherscan.io/',
    etherscanEndpoint: 'https://api.etherscan.io',
    apiKey: ETHERSCAN_API_KEY,
  },
  goerli: {
    name: 'goerli',
    chainId: 5,
    blockExplorer: 'https://goerli.etherscan.io/',
    rpcUrl: `https://eth-goerli.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    etherscanEndpoint: 'https://api-goerli.etherscan.io',
    apiKey: ETHERSCAN_API_KEY,
  },
  polygon: {
    name: 'polygon',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com/',
    blockExplorer: 'https://polygonscan.com/',
    etherscanEndpoint: 'https://api.polygonscan.com',
    apiKey: POLYGONSCAN_API_KEY,
  },
  mumbai: {
    name: 'mumbai',
    chainId: 80001,
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    blockExplorer: 'https://mumbai.polygonscan.com/',
    etherscanEndpoint: 'https://api-testnet.polygonscan.com',
    apiKey: POLYGONSCAN_API_KEY,
  },
  goerliOptimism: {
    name: 'goerliOptimism',
    chainId: 420,
    blockExplorer: 'https://goerli-optimism.etherscan.io/',
    rpcUrl: 'https://goerli.optimism.io',
    etherscanEndpoint: 'https://api-goerli-optimism.etherscan.io',
    apiKey: ETHERSCAN_API_KEY,
  },
  optimism: {
    name: 'optimism',
    chainId: 10,
    blockExplorer: 'https://optimistic.etherscan.io/',
    rpcUrl: 'https://mainnet.optimism.io',
    etherscanEndpoint: 'https://api-optimistic.etherscan.io',
    apiKey: ETHERSCAN_API_KEY,
  },
  arbitrum: {
    name: 'arbitrum',
    chainId: 42161,
    blockExplorer: 'https://arbiscan.io/',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    etherscanEndpoint: 'https://api.arbiscan.io',
    apiKey: ETHERSCAN_API_KEY,
  },
};
