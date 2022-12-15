import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';

export const Error404 = memo(() => {
  return (
    <Box data-testid="error-404">
      <Typography>This page does not exist.</Typography>
    </Box>
  );
});
