import { JSXElementConstructor, ReactElement } from 'react';
import {
  render as baseRender,
  renderHook as baseRenderHook,
  RenderOptions,
  RenderResult,
  RenderHookResult,
  Queries,
  queries,
  RenderHookOptions,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@app/redux/store';
import { theme } from '@app/utils/mui';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { wagmiClient } from '@app/utils/wallet';
import { WagmiConfig } from 'wagmi';
import { AppSnackbarProvider } from '@app/components/common/AppSnackbarProvider';

const getCustomWrapper = (
  Wrapper?: JSXElementConstructor<{
    children: ReactElement<any, string | JSXElementConstructor<any>>;
  }>
) => {
  return ({ children }: { children: ReactElement }) => (
    <Provider store={store}>
      <CssVarsProvider theme={theme}>
        <WagmiConfig client={wagmiClient}>
          <AppSnackbarProvider>
            {Wrapper ? <Wrapper>{children}</Wrapper> : children}
          </AppSnackbarProvider>
        </WagmiConfig>
      </CssVarsProvider>
    </Provider>
  );
};

export const render = (ui: ReactElement, options?: RenderOptions): RenderResult => {
  return baseRender(ui, {
    ...options,
    wrapper: getCustomWrapper(options?.wrapper),
  });
};

export const renderHook = <
  Result,
  Props,
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement,
  BaseElement extends Element | DocumentFragment = Container
>(
  renderFn: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props, Q, Container, BaseElement>
): RenderHookResult<Result, Props> => {
  return baseRenderHook(renderFn, {
    ...options,
    wrapper: getCustomWrapper(options?.wrapper),
  });
};
