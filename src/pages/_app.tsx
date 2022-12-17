import { ReactNode, useEffect } from 'react';
import type { AppProps } from 'next/app';
import { Box } from '@mui/material';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { Toolbar } from '@app/components/Toolbar/Toolbar';
import { theme } from '@app/utils/theme';
import { store, persistor } from '@app/redux/store';
import { wagmiClient, ethereumClient } from '@app/utils/wallet';
import {
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  WALLETCONNECT_PROJECT_ID,
} from '@app/utils/constants';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { WagmiConfig } from 'wagmi';
import { Web3Modal } from '@web3modal/react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

import '@app/styles/globals.css';
import '@app/styles/react-grid-layout.css';
import { FullscreenLoader } from '@app/components/common/FullscreenLoader';
import Head from 'next/head';

type Auth0RedirectWrapperProps = {
  children: ReactNode;
};

const Auth0RedirectWrapper = ({ children }: Auth0RedirectWrapperProps) => {
  const { isLoading, isAuthenticated, loginWithRedirect } = useAuth0();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      loginWithRedirect({ redirectUri: window.location.origin });
    }
  }, [isLoading, isAuthenticated, loginWithRedirect]);

  if (isLoading) {
    return <FullscreenLoader />;
  }

  return children as JSX.Element;
};

const App = ({ Component, pageProps }: AppProps) => {
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
                      bgcolor: 'background.paper',
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
