import { useCallback } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { blurFocus, deleteComponent } from '@app/redux/features/editorSlice';

export const EditorComponentInspector = () => {
  const { focusedComponentId } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  const handleDelete = useCallback(() => {
    dispatch(deleteComponent(focusedComponentId!));
    dispatch(blurFocus());
  }, [dispatch, focusedComponentId]);

  return (
    <Box data-testid="editor-component-inspector">
      {focusedComponentId ? (
        <>
          <Typography>{focusedComponentId}</Typography>
          <Button onClick={handleDelete}>Delete</Button>
        </>
      ) : (
        <Typography>No focused component</Typography>
      )}
    </Box>
  );
};
