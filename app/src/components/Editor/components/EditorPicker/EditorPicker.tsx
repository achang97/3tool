import React, { memo } from 'react';
import { Box } from '@mui/material';
import { ComponentType } from 'types';
import { EditorDraggable } from './EditorDraggable';

export const EditorPicker = memo(() => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <EditorDraggable componentType={ComponentType.Button}>
        Button
      </EditorDraggable>
      <EditorDraggable componentType={ComponentType.TextInput}>
        Text Input
      </EditorDraggable>
      <EditorDraggable componentType={ComponentType.Select}>
        Select
      </EditorDraggable>
      <EditorDraggable componentType={ComponentType.Table}>
        Table
      </EditorDraggable>
    </Box>
  );
});
