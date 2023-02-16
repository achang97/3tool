import { resetComponentInput } from '@app/redux/features/activeToolSlice';
import { blurComponent } from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { isSuccessfulApiResponse } from '@app/utils/api';
import { useCallback } from 'react';
import { useActiveTool } from './useActiveTool';

export const useDeleteComponent = (name: string) => {
  const dispatch = useAppDispatch();
  const { tool, updateTool } = useActiveTool();

  const handleDeleteComponent = useCallback(async () => {
    const response = await updateTool({
      components: tool.components.filter(
        (currComponent) => currComponent.name !== name
      ),
    });

    if (!isSuccessfulApiResponse(response)) {
      return false;
    }

    dispatch(blurComponent());
    dispatch(resetComponentInput(name));
    return true;
  }, [dispatch, name, tool.components, updateTool]);

  return handleDeleteComponent;
};
