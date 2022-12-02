import React, { DragEvent, memo, ReactNode, useCallback, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ComponentType } from 'types';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import {
  startCreateComponentDrag,
  endCreateComponentDrag,
} from 'redux/features/editorSlice';

type EditorDraggableProps = {
  componentType: ComponentType;
  children: ReactNode;
};

const HIDDEN_IMG = (() => {
  const img = new Image(0, 0);
  img.src =
    'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
  return img;
})();

export const EditorDraggable = memo(
  ({ children, componentType }: EditorDraggableProps) => {
    const { newComponent } = useAppSelector((state) => state.editor);
    const dispatch = useAppDispatch();

    const handleDragStart = useCallback(
      (e: DragEvent) => {
        e.dataTransfer.setDragImage(HIDDEN_IMG, 0, 0);
        e.dataTransfer.setData('text/plain', '');
        dispatch(startCreateComponentDrag(componentType));
      },
      [componentType, dispatch]
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
  }
);
