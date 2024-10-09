import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Box, Stack } from '@mui/material';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { Toolbar } from '@app/components/toolbar/Toolbar';
import { theme } from '@app/utils/mui';
import { wrapper } from '@app/redux/store';
import { wagmiClient } from '@app/constants/wallet';
import { Provider } from 'react-redux';
import { WagmiConfig } from 'wagmi';
import { initFetch } from '@app/utils/global';
import { AppSnackbarProvider } from '@app/components/common/AppSnackbarProvider';
import { baseFont } from '@app/styles/font';
import { useMockServiceWorkers } from '@app/hooks/useMockServiceWorkers';

import '@app/styles/globals.css';
import '@app/styles/react-grid-layout.css';
import '@app/styles/codemirror.css';

initFetch();

const App = ({ Component, ...rest }: AppProps) => {
  const { store, props } = wrapper.useWrappedStore(rest);

  useMockServiceWorkers();

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
        <CssVarsProvider theme={theme}>
          <WagmiConfig client={wagmiClient}>
            <AppSnackbarProvider>
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
            </AppSnackbarProvider>
          </WagmiConfig>
        </CssVarsProvider>
      </Provider>
    </>
  );
};

export default App;
