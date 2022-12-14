import React, { Box, CircularProgress } from '@mui/material';
import { memo } from 'react';

export const FullscreenLoader = memo(() => {
  return (
    <Box
      sx={{
        display: 'flex',
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress data-testid="fullscreen-loader" />
    </Box>
  );
});
