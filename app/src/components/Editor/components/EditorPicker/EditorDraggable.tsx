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
      isDragging,
      setIsDragging,
      setComponentType,
      componentType: currComponentType,
    } = useNewComponentDrag();

    const handleDragStart = useCallback(
      (e: DragEvent) => {
        e.dataTransfer.setDragImage(HIDDEN_IMG, 0, 0);
        e.dataTransfer.setData('text/plain', '');
        setIsDragging(true);
        setComponentType(componentType);
      },
      [componentType, setComponentType, setIsDragging]
    );

    const handleDragEnd = useCallback(() => {
      setIsDragging(false);
      setComponentType(undefined);
    }, [setComponentType, setIsDragging]);

    return (
      <Box
        sx={{
          margin: 2,
          cursor: 'pointer',
          opacity: isDragging && componentType === currComponentType ? 0.5 : 1,
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
