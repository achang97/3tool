import { Box } from '@mui/material';
import { ComponentType } from '@app/types';
import { ToolEditorDraggable } from './ToolEditorDraggable';

export const ToolEditorPicker = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <ToolEditorDraggable componentType={ComponentType.Button}>
        Button
      </ToolEditorDraggable>
      <ToolEditorDraggable componentType={ComponentType.TextInput}>
        Text Input
      </ToolEditorDraggable>
      <ToolEditorDraggable componentType={ComponentType.Select}>
        Select
      </ToolEditorDraggable>
      <ToolEditorDraggable componentType={ComponentType.Table}>
        Table
      </ToolEditorDraggable>
    </Box>
  );
};
