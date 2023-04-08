import { ReactElement } from 'react';
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
import { ThemeProvider } from '@mui/material';
import { theme } from '@app/utils/mui';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';

export const render = (
  ui: ReactElement,
  options?: RenderOptions
): RenderResult => {
  return baseRender(ui, {
    ...options,
    wrapper: ({ children }: { children: ReactElement }) => (
      <Provider store={store}>
        <CssVarsProvider theme={theme}>
          {options?.wrapper ? (
            <options.wrapper>{children}</options.wrapper>
          ) : (
            children
          )}
        </CssVarsProvider>
      </Provider>
    ),
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
    wrapper: ({ children }: { children: ReactElement }) => (
      <Provider store={store}>
        <CssVarsProvider theme={theme}>
          {options?.wrapper ? (
            <options.wrapper>{children}</options.wrapper>
          ) : (
            children
          )}
        </CssVarsProvider>
      </Provider>
    ),
  });
};
