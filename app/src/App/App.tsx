import React, { memo } from 'react';
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { Box } from '@mui/material';
import { Editor } from 'components/Editor/Editor';
import { ModeToggle } from 'components/ModeToggle/ModeToggle';
import { theme } from 'utils/theme';

export const App = memo(() => {
  return (
    <CssVarsProvider theme={theme}>
      <Box sx={{ bgcolor: 'background.paper', height: '100%' }}>
        <ModeToggle />
        <Box sx={{ textAlign: 'center', height: '100%' }}>
          <Editor />
        </Box>
      </Box>
    </CssVarsProvider>
  );
});
