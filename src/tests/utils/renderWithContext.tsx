import React, { ReactElement } from 'react';
import {
  render as baseRender,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'redux/store';
import { BrowserRouter } from 'react-router-dom';

export const render = (
  ui: ReactElement,
  options: RenderOptions & { router: boolean } = { router: true }
): RenderResult => {
  const { router } = options;

  let element = <Provider store={store}>{ui}</Provider>;
  if (router) {
    element = <BrowserRouter>{element}</BrowserRouter>;
  }

  return baseRender(element, options);
};
