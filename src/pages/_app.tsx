import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Box, Stack } from '@mui/material';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { Toolbar } from '@app/components/toolbar/Toolbar';
import { theme } from '@app/utils/mui';
import { persistor, wrapper } from '@app/redux/store';
import { wagmiClient } from '@app/utils/wallet';
import { Provider } from 'react-redux';
import { WagmiConfig } from 'wagmi';
import { initFetch } from '@app/utils/global';
import { AuthRedirectProvider } from '@app/components/auth/contexts/AuthRedirectProvider';
import { ConnectWalletModal } from '@app/components/common/ConnectWalletModal';
import { PersistGate } from 'redux-persist/integration/react';
import { AppSnackbarProvider } from '@app/components/common/AppSnackbarProvider';
import { baseFont } from '@app/styles/font';
import { useMockServiceWorkers } from '@app/hooks/useMockServiceWorkers';
import { useRouteChangeListener } from '@app/hooks/useRouteChangeListener';

import '@app/styles/globals.css';
import '@app/styles/react-grid-layout.css';
import '@app/styles/codemirror.css';

initFetch();

const App = ({ Component, ...rest }: AppProps) => {
  const { store, props } = wrapper.useWrappedStore(rest);

  useMockServiceWorkers();
  useRouteChangeListener();

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
                    <Box sx={{ flex: 1, overflowY: 'auto' }}>
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
