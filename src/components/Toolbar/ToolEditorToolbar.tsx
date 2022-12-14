import React, { memo, useMemo } from 'react';
import { Typography } from '@mui/material';
import { ToolbarTemplate } from './ToolbarTemplate';

export const ToolEditorToolbar = memo(() => {
  const middle = useMemo(() => {
    return <Typography>Tool Editor</Typography>;
  }, []);

  return <ToolbarTemplate middle={middle} />;
});
