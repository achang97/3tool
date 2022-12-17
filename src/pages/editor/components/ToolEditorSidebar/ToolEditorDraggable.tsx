import { DragEvent, ReactNode, useCallback, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ComponentType } from '@app/types';
import { useAppSelector, useAppDispatch } from '@app/redux/hooks';
import {
  startCreateComponentDrag,
  endCreateComponentDrag,
} from '@app/redux/features/editorSlice';

type ToolEditorDraggableProps = {
  componentType: ComponentType;
  children: ReactNode;
};

export const ToolEditorDraggable = ({
  children,
  componentType,
}: ToolEditorDraggableProps) => {
  const { newComponent } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  const hiddenImage = useMemo(() => {
    const img = new Image(0, 0);
    img.src =
      'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    return img;
  }, []);

  const handleDragStart = useCallback(
    (e: DragEvent) => {
      e.dataTransfer.setDragImage(hiddenImage, 0, 0);
      e.dataTransfer.setData('text/plain', '');
      dispatch(startCreateComponentDrag(componentType));
    },
    [componentType, dispatch, hiddenImage]
  );

  const handleDragEnd = useCallback(() => {
    dispatch(endCreateComponentDrag());
  }, [dispatch]);

  const isCurrentlyDragged = useMemo(
    () => componentType === newComponent?.type,
    [componentType, newComponent]
  );

  return (
    <Box
      sx={{
        margin: 2,
        cursor: 'pointer',
        opacity: isCurrentlyDragged ? 0.5 : 1,
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      draggable
      unselectable="on"
    >
      <Typography sx={{ color: 'text.primary' }}>{children}</Typography>
    </Box>
  );
};
