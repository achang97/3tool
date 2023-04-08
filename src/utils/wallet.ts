import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from '@web3modal/ethereum';
import { configureChains, createClient } from 'wagmi';
import { CHAINS, WALLETCONNECT_PROJECT_ID } from '@app/constants';

// Wagmi client
const { provider } = configureChains(CHAINS, [
  w3mProvider({ projectId: WALLETCONNECT_PROJECT_ID }),
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({
    chains: CHAINS,
    projectId: WALLETCONNECT_PROJECT_ID,
    version: 1,
  }),
  provider,
});

// Web3Modal Ethereum Client
export const ethereumClient = new EthereumClient(wagmiClient, CHAINS);
