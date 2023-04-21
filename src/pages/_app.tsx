import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Box, Stack } from '@mui/material';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { Toolbar } from '@app/components/toolbar/Toolbar';
import { theme } from '@app/utils/mui';
import { persistor, wrapper } from '@app/redux/store';
import { wagmiClient } from '@app/utils/wallet';
import { MSW_API } from '@app/constants';
import { Provider } from 'react-redux';
import { WagmiConfig } from 'wagmi';
import { initFetch } from '@app/utils/global';
import { AuthRedirectProvider } from '@app/components/auth/contexts/AuthRedirectProvider';
import { ConnectWalletModal } from '@app/components/common/ConnectWalletModal';

import '@app/styles/globals.css';
import '@app/styles/react-grid-layout.css';
import '@app/styles/codemirror.css';
import { PersistGate } from 'redux-persist/integration/react';
import { AppSnackbarProvider } from '@app/components/common/AppSnackbarProvider';
import { baseFont } from '@app/styles/font';

// Start MSW on the server
if (MSW_API) {
  // eslint-disable-next-line global-require
  require('@mocks/init');
}

initFetch();

const App = ({ Component, ...rest }: AppProps) => {
  const { store, props } = wrapper.useWrappedStore(rest);

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
        <style>{`
          :root {
            --font-base: ${baseFont};
          }
        `}</style>
      </Head>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CssVarsProvider theme={theme}>
            <WagmiConfig client={wagmiClient}>
              <AppSnackbarProvider>
                <AuthRedirectProvider>
                  <Stack
                    sx={{
                      backgroundColor: 'background.paper',
                      height: '100%',
                    }}
                  >
                    <Toolbar />
                    <Box sx={{ flex: 1, overflowY: 'scroll' }}>
                      <Component {...props.pageProps} />
                    </Box>
                  </Stack>
                  <ConnectWalletModal />
                </AuthRedirectProvider>
              </AppSnackbarProvider>
            </WagmiConfig>
          </CssVarsProvider>
        </PersistGate>
      </Provider>
    </>
  );
};

export default App;
