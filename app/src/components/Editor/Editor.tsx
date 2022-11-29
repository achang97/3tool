import React, { memo } from 'react';
import { Box } from '@mui/material';
import { EditorCanvas } from './components/EditorCanvas/EditorCanvas';
import { EditorPicker } from './components/EditorPicker/EditorPicker';

export const Editor = memo(() => {
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
      <Box sx={{ flex: 3 }}>
        <EditorCanvas />
      </Box>
      <Box sx={{ flex: 1 }}>
        <EditorPicker />
      </Box>
    </Box>
  );
});
