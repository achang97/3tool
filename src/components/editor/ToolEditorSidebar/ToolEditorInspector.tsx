import { useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { blurFocus, deleteComponent } from '@app/redux/features/editorSlice';

export const ToolEditorInspector = () => {
  const { focusedComponentId } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(() => {
    dispatch(deleteComponent(focusedComponentId!));
    dispatch(blurFocus());
  }, [dispatch, focusedComponentId]);

  if (!focusedComponentId) {
    return <Box>No focused component</Box>;
  }
  return (
    <Box>
      <Typography>{focusedComponentId}</Typography>
      <Button onClick={handleDelete}>Delete</Button>
    </Box>
  );
};
