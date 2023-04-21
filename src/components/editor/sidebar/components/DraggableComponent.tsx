import { DragEvent, ReactNode, useCallback, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { ComponentType } from '@app/types';
import { useAppSelector, useAppDispatch } from '@app/redux/hooks';
import { startCreateComponentDrag, stopCreateComponentDrag } from '@app/redux/features/editorSlice';
import { createNameWithPrefix } from '../../utils/elements';
import { useToolElementNames } from '../../hooks/useToolElementNames';

type DraggableComponentProps = {
  type: ComponentType;
  label: string;
  icon: ReactNode;
};

export const DraggableComponent = ({ label, icon, type }: DraggableComponentProps) => {
  const { componentNames } = useToolElementNames();
  const { newComponent } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  const hiddenImage = useMemo(() => {
    const img = new Image(0, 0);
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    return img;
  }, []);

  const handleDragStart = useCallback(
    (e: DragEvent) => {
      e.dataTransfer.setDragImage(hiddenImage, 0, 0);
      e.dataTransfer.setData('text/plain', '');
      dispatch(
        startCreateComponentDrag({
          type,
          name: createNameWithPrefix(type, componentNames),
        })
      );
    },
    [dispatch, hiddenImage, componentNames, type]
  );

  const handleDragEnd = useCallback(() => {
    dispatch(stopCreateComponentDrag());
  }, [dispatch]);

  const isDragging = useMemo(() => type === newComponent?.type, [type, newComponent]);

  return (
    <Box
      sx={{
        cursor: 'pointer',
        opacity: isDragging ? 0.5 : 1,
        textAlign: 'center',
      }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      draggable
      unselectable="on"
    >
      <Box
        sx={{
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'greyscale.offwhite.main',
          borderRadius: 1,
        }}
      >
        {icon}
      </Box>
      <Typography variant="body2" sx={{ marginTop: 1 }}>
        {label}
      </Typography>
    </Box>
  );
};
