import {
  blurComponentFocus,
  focusToolSettings,
} from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { Box, Button } from '@mui/material';
import { useCallback, MouseEvent } from 'react';
import { EditorDroppable } from './canvas/EditorDroppable';
import { EditorToolbar } from './canvas/EditorToolbar';

export const EditorCanvas = () => {
  const dispatch = useAppDispatch();

  const handleCanvasClick = useCallback(() => {
    dispatch(blurComponentFocus());
  }, [dispatch]);

  const handleToolClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      dispatch(focusToolSettings());
    },
    [dispatch]
  );

  return (
    <Box
      sx={{
        backgroundColor: 'greyscale.offwhite.main',
        paddingX: 4,
        paddingTop: 1,
        paddingBottom: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
      }}
      onClick={handleCanvasClick}
    >
      <Button
        size="small"
        color="secondary"
        sx={{ marginBottom: 0.5, alignSelf: 'flex-start' }}
        onClick={handleToolClick}
      >
        tool
      </Button>
      <Box
        sx={{
          borderRadius: 1,
          backgroundColor: 'background.paper',
          boxShadow: 4,
          flex: 1,
        }}
      >
        <EditorToolbar />
        <EditorDroppable />
      </Box>
    </Box>
  );
};
