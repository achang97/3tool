import React, { memo } from 'react';
import { Box } from '@mui/material';
import { useAppSelector } from 'redux/hooks';

export const EditorInspector = memo(() => {
  const { focusedComponentId } = useAppSelector((state) => state.editor);
  return <Box>{focusedComponentId}</Box>;
});
