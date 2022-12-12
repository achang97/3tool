import {
  EthereumClient,
  modalConnectors,
  walletConnectProvider,
} from '@web3modal/ethereum';
import { configureChains, createClient } from 'wagmi';
import { CHAINS, WALLETCONNECT_PROJECT_ID } from './constants';

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
