import { blurAction } from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { isSuccessfulApiResponse } from '@app/utils/api';
import { useCallback } from 'react';
import { useActiveTool } from './useActiveTool';

export const useDeleteAction = (name: string) => {
  const dispatch = useAppDispatch();
  const { tool, updateTool } = useActiveTool();

  const handleDeleteAction = useCallback(async () => {
    const response = await updateTool({
      actions: tool.actions.filter((currAction) => currAction.name !== name),
    });

    if (!isSuccessfulApiResponse(response)) {
      return false;
    }

    dispatch(blurAction());
    return true;
  }, [dispatch, name, tool.actions, updateTool]);

  return handleDeleteAction;
};
