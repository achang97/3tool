import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { chain, configureChains, createClient } from 'wagmi';

export const WALLETCONNECT_PROJECT_ID = '3ec3435dbc431754e7edbe6563c48a4d';

export const CHAINS = [
  chain.mainnet,
  chain.goerli,
  chain.polygon,
  chain.polygonMumbai,
  chain.optimism,
  chain.optimismGoerli,
  chain.arbitrum,
  chain.arbitrumGoerli,
];

// Wagmi client
const { provider } = configureChains(CHAINS, [
  walletConnectProvider({ projectId: WALLETCONNECT_PROJECT_ID }),
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: modalConnectors({ appName: 'web3Modal', chains: CHAINS }),
  provider,
});

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiClient, CHAINS);
