import React, { memo } from 'react';
import { Box } from '@mui/material';
import { EditorCanvas } from './components/EditorCanvas/EditorCanvas';
import { EditorPicker } from './components/EditorPicker/EditorPicker';
import { NewComponentDragProvider } from './contexts/NewComponentDragContext';

export const Editor = memo(() => {
  return (
    <NewComponentDragProvider>
      <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
        <Box sx={{ flex: 3 }}>
          <EditorCanvas />
        </Box>
        <Box sx={{ flex: 1 }}>
          <EditorPicker />
        </Box>
      </Box>
    </NewComponentDragProvider>
  );
});
