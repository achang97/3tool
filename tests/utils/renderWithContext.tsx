import { ReactElement, ReactNode } from 'react';
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

export const render = (
  ui: ReactElement,
  options?: RenderOptions
): RenderResult => {
  return baseRender(ui, {
    ...options,
    wrapper: ({ children }: { children: ReactElement }) => (
      <Provider store={store}>
        {options?.wrapper ? (
          <options.wrapper>{children}</options.wrapper>
        ) : (
          children
        )}
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
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );

  return baseRenderHook(renderFn, { wrapper, ...options });
};
