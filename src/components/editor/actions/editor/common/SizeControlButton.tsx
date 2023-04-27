import { ACTION_VIEW_MAX_HEIGHT, ACTION_VIEW_MIN_HEIGHT } from '@app/constants';
import { setActionViewHeight } from '@app/redux/features/editorSlice';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { ZoomInMap, ZoomOutMap } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { useCallback, useMemo } from 'react';

export const SizeControlButton = () => {
  const { actionViewHeight } = useAppSelector((state) => state.editor);
  const dispatch = useAppDispatch();

  const isMaxHeight = useMemo(() => {
    return actionViewHeight === ACTION_VIEW_MAX_HEIGHT;
  }, [actionViewHeight]);

  const handleClick = useCallback(() => {
    const newHeight = isMaxHeight ? ACTION_VIEW_MIN_HEIGHT : ACTION_VIEW_MAX_HEIGHT;
    dispatch(setActionViewHeight(newHeight));
  }, [dispatch, isMaxHeight]);

  return (
    <IconButton onClick={handleClick} size="small" data-testid="size-control-button">
      {isMaxHeight ? (
        <ZoomInMap data-testid="size-control-button-minimize" />
      ) : (
        <ZoomOutMap data-testid="size-control-button-maximize" />
      )}
    </IconButton>
  );
};
