import { useMemo } from 'react';
import { Typography } from '@mui/material';
import { ToolbarTemplate } from './ToolbarTemplate';

export const ToolEditorToolbar = () => {
  const middle = useMemo(() => {
    return <Typography>Tool Editor</Typography>;
  }, []);

  return <ToolbarTemplate middle={middle} testId="tool-editor-toolbar" />;
};
