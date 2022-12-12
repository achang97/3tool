import React, { memo } from 'react';
import { Box, Typography } from '@mui/material';
import { ToolbarLogo } from './ToolbarLogo';

export const ToolViewerToolbar = memo(() => {
  return (
    <Box
      sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
    >
      <ToolbarLogo />
      <Typography>Tool Viewer</Typography>
    </Box>
  );
});
