import React, { memo, useMemo } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';
import { GeneralToolbar } from './GeneralToolbar';
import { ToolViewerToolbar } from './ToolViewerToolbar';
import { ToolEditorToolbar } from './ToolEditorToolbar';

export const Toolbar = memo(() => {
  const { isAuthenticated } = useAuth0();
  const { pathname } = useLocation();

  const toolbar = useMemo(() => {
    if (pathname.startsWith('/tools')) {
      return <ToolViewerToolbar />;
    }

    if (pathname.startsWith('/editor')) {
      return <ToolEditorToolbar />;
    }

    return <GeneralToolbar />;
  }, [pathname]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box sx={{ height: '48px', display: 'flex', alignItems: 'center' }}>
      {toolbar}
    </Box>
  );
});
