import { blurComponent, focusToolSettings } from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { Box, Button, Stack } from '@mui/material';
import { useCallback, MouseEvent } from 'react';
import { EditorApp } from './EditorApp';

type EditorCanvasProps = {
  isEditable: boolean;
};

export const EditorCanvas = ({ isEditable }: EditorCanvasProps) => {
  const dispatch = useAppDispatch();

  const handleCanvasClick = useCallback(() => {
    dispatch(blurComponent());
  }, [dispatch]);

  const handleToolClick = useCallback(
    (e: MouseEvent) => {
      e.stopPropagation();
      dispatch(focusToolSettings());
    },
    [dispatch]
  );

  return (
    <Stack
      sx={{
        backgroundColor: 'greyscale.offwhite.main',
        paddingX: 4,
        paddingTop: 1,
        paddingBottom: 2,
        height: '100%',
        overflowY: 'auto',
      }}
      onClick={handleCanvasClick}
      data-testid="editor-canvas"
    >
      {isEditable && (
        <Button
          size="small"
          color="secondary"
          sx={{ marginBottom: 0.5, alignSelf: 'flex-start' }}
          onClick={handleToolClick}
        >
          app
        </Button>
      )}
      <Box
        sx={{
          borderRadius: 1,
          backgroundColor: 'background.paper',
          boxShadow: 4,
          flex: 1,
        }}
      >
        <EditorApp isEditable={isEditable} />
      </Box>
    </Stack>
  );
};
