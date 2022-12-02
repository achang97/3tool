import React, { memo } from 'react';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Toolbar } from 'components/Toolbar';
import { theme } from 'utils/theme';
import { Router } from 'routing/Router';
import { store, persistor } from 'redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { WagmiConfig } from 'wagmi';
import {
  wagmiClient,
  ethereumClient,
  WALLETCONNECT_PROJECT_ID,
} from 'utils/wallet';
import { Web3Modal } from '@web3modal/react';

export const App = memo(() => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <CssVarsProvider theme={theme}>
          <WagmiConfig client={wagmiClient}>
            <Box sx={{ bgcolor: 'background.paper', height: '100%' }}>
              <Toolbar />
              <Box sx={{ height: '100%' }}>
                <Router />
              </Box>
            </Box>
            <Web3Modal
              projectId={WALLETCONNECT_PROJECT_ID}
              ethereumClient={ethereumClient}
            />
          </WagmiConfig>
        </CssVarsProvider>
      </PersistGate>
    </Provider>
  );
});
