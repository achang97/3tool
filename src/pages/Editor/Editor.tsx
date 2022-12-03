import React, { memo } from 'react';
import { Box } from '@mui/material';
import { EditorCanvas } from './components/EditorCanvas/EditorCanvas';
import { EditorSidebar } from './components/EditorSidebar/EditorSidebar';
import { EditorQueryBuilder } from './components/EditorQueryBuilder/EditorQueryBuilder';

export const Editor = memo(() => {
  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 3 }}>
        <Box sx={{ flex: 3 }}>
          <EditorCanvas />
        </Box>
        <Box sx={{ flex: 1 }}>
          <EditorQueryBuilder />
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <EditorSidebar />
      </Box>
    </Box>
  );
});
