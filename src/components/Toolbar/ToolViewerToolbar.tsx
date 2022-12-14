import React, { memo, useMemo } from 'react';
import { Typography } from '@mui/material';
import { ToolbarTemplate } from './ToolbarTemplate';

export const ToolViewerToolbar = memo(() => {
  const middle = useMemo(() => {
    return <Typography>Tool Viewer</Typography>;
  }, []);

  return <ToolbarTemplate middle={middle} />;
});
