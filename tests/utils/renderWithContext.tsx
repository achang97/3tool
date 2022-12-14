import React, { ReactElement } from 'react';
import {
  render as baseRender,
  RenderOptions,
  RenderResult,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from 'redux/store';

export const render = (
  ui: ReactElement,
  options?: RenderOptions
): RenderResult => {
  return baseRender(<Provider store={store}>{ui}</Provider>, options);
};
