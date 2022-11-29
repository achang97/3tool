import React, { DragEvent, memo, ReactNode, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { ComponentType } from 'types';
import { useAppSelector, useAppDispatch } from 'redux/hooks';
import { RootState } from 'redux/store';
import { startCreate, stopCreate } from 'redux/features/canvasSlice';

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
    const { isCreating, newComponentType } = useAppSelector(
      (state: RootState) => state.canvas
    );
    const dispatch = useAppDispatch();

    const handleDragStart = useCallback(
      (e: DragEvent) => {
        e.dataTransfer.setDragImage(HIDDEN_IMG, 0, 0);
        e.dataTransfer.setData('text/plain', '');
        dispatch(startCreate(componentType));
      },
      [componentType, dispatch]
    );

    const handleDragEnd = useCallback(() => {
      dispatch(stopCreate());
    }, [dispatch]);

    return (
      <Box
        sx={{
          margin: 2,
          cursor: 'pointer',
          opacity: isCreating && componentType === newComponentType ? 0.5 : 1,
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
