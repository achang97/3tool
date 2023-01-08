import React, { FC } from 'react';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { theme } from '../../src/utils/mui';

export const withMuiThemeProvider = (Story: FC) => {
  return (
    <CssVarsProvider theme={theme}>
      <Story />
    </CssVarsProvider>
  );
};
