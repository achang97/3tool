import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Box } from '@mui/material';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { Toolbar } from '@app/components/toolbar/Toolbar';
import { theme } from '@app/utils/mui';
import { store, persistor } from '@app/redux/store';
import { wagmiClient, ethereumClient } from '@app/utils/wallet';
import {
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  MSW_API,
  WALLETCONNECT_PROJECT_ID,
} from '@app/utils/constants';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { WagmiConfig } from 'wagmi';
import { Web3Modal } from '@web3modal/react';
import { Auth0Provider } from '@auth0/auth0-react';
import { Auth0RedirectWrapper } from '@app/components/auth0/Auth0RedirectWrapper';

import '@app/styles/globals.css';
import '@app/styles/react-grid-layout.css';

// Start MSW on the server
if (MSW_API) {
  // eslint-disable-next-line global-require
  require('@mocks/init');
}

const App = ({ Component, pageProps }: AppProps) => {
  // Start MSW on the browser
  useEffect(() => {
    if (MSW_API) {
      // eslint-disable-next-line global-require
      require('@mocks/init');
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Auth0Provider domain={AUTH0_DOMAIN} clientId={AUTH0_CLIENT_ID}>
            <CssVarsProvider theme={theme}>
              <WagmiConfig client={wagmiClient}>
                <Auth0RedirectWrapper>
                  <Box
                    sx={{
                      backgroundColor: 'background.paper',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <Toolbar />
                    <Box sx={{ flex: 1, overflowY: 'scroll' }}>
                      <Component {...pageProps} />
                    </Box>
                  </Box>
                  <Web3Modal
                    projectId={WALLETCONNECT_PROJECT_ID}
                    ethereumClient={ethereumClient}
                  />
                </Auth0RedirectWrapper>
              </WagmiConfig>
            </CssVarsProvider>
          </Auth0Provider>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
