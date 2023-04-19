import { resetComponentInput } from '@app/redux/features/activeToolSlice';
import { blurComponent } from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { useCallback } from 'react';
import { useActiveTool } from './useActiveTool';

export const useComponentDelete = (name: string) => {
  const dispatch = useAppDispatch();
  const { tool, updateTool } = useActiveTool();

  const handleDeleteComponent = useCallback(async () => {
    const updatedTool = await updateTool({
      components: tool.components.filter((currComponent) => currComponent.name !== name),
    });

    if (!updatedTool) {
      return false;
    }

    dispatch(blurComponent());
    dispatch(resetComponentInput(name));
    return true;
  }, [dispatch, name, tool.components, updateTool]);

  return handleDeleteComponent;
};
