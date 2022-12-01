import React, { memo } from 'react';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Toolbar } from 'components/Toolbar';
import { theme } from 'utils/theme';
import { Router } from 'routing/Router';

export const App = memo(() => {
  return (
    <CssVarsProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.paper', height: '100%' }}>
        <Toolbar />
        <Box sx={{ height: '100%' }}>
          <Router />
        </Box>
      </Box>
    </CssVarsProvider>
  );
});
