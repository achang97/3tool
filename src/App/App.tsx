import React, { memo } from 'react';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
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
import { Auth0Provider } from '@auth0/auth0-react';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from 'utils/constants';

export const App = memo(() => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Auth0Provider
          domain={AUTH0_DOMAIN}
          clientId={AUTH0_CLIENT_ID}
          redirectUri={window.location.origin}
        >
          <CssVarsProvider theme={theme}>
            <WagmiConfig client={wagmiClient}>
              <Box sx={{ bgcolor: 'background.paper', height: '100%' }}>
                <Router />
              </Box>
              <Web3Modal
                projectId={WALLETCONNECT_PROJECT_ID}
                ethereumClient={ethereumClient}
              />
            </WagmiConfig>
          </CssVarsProvider>
        </Auth0Provider>
      </PersistGate>
    </Provider>
  );
});
