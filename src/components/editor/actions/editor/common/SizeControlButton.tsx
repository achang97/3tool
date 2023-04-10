import { setIsActionViewMaximized } from '@app/redux/features/editorSlice';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { Fullscreen, FullscreenExit } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCallback } from 'react';

export const SizeControlButton = () => {
  const { isActionViewMaximized } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  const handleClick = useCallback(() => {
    dispatch(setIsActionViewMaximized(!isActionViewMaximized));
  }, [dispatch, isActionViewMaximized]);

  return (
    <IconButton onClick={handleClick} size="small" data-testid="size-control-button">
      {isActionViewMaximized ? (
        <FullscreenExit data-testid="size-control-button-minimize" />
      ) : (
        <Fullscreen data-testid="size-control-button-maximize" />
      )}
    </IconButton>
  );
};
