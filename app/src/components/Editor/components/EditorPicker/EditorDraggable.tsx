import React, { DragEvent, memo, ReactNode, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { useNewComponentDrag } from 'components/Editor/hooks/useNewComponentDrag';
import { ComponentType } from 'types';

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
    const {
      isDraggingNew,
      setIsDraggingNew,
      setComponentType,
      componentType: currComponentType,
    } = useNewComponentDrag();

    const handleDragStart = useCallback(
      (e: DragEvent) => {
        e.dataTransfer.setDragImage(HIDDEN_IMG, 0, 0);
        e.dataTransfer.setData('text/plain', '');
        setIsDraggingNew(true);
        setComponentType(componentType);
      },
      [componentType, setComponentType, setIsDraggingNew]
    );

    const handleDragEnd = useCallback(() => {
      setIsDraggingNew(false);
      setComponentType(undefined);
    }, [setComponentType, setIsDraggingNew]);

    return (
      <Box
        sx={{
          margin: 2,
          cursor: 'pointer',
          opacity:
            isDraggingNew && componentType === currComponentType ? 0.5 : 1,
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
