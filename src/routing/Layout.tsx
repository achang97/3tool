import React, { memo } from 'react';
import { Toolbar } from 'components/Toolbar/Toolbar';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

export const Layout = memo(() => {
  return (
    <Box sx={{ bgcolor: 'background.paper', height: '100%' }}>
      <Toolbar />
      <Outlet />
    </Box>
  );
});
