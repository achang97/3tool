import { useMemo } from 'react';
import { Typography } from '@mui/material';
import { ToolbarTemplate } from '../common/ToolbarTemplate';

export const ToolViewerToolbar = () => {
  const middle = useMemo(() => {
    return <Typography>Tool Viewer</Typography>;
  }, []);

  return <ToolbarTemplate middle={middle} testId="tool-viewer-toolbar" />;
};
