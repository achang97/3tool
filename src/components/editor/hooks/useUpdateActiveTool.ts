import { setSnackbarMessage } from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { useUpdateToolMutation } from '@app/redux/services/tools';
import { ApiResponse, Tool } from '@app/types';
import { parseApiError } from '@app/utils/api';
import { useCallback, useEffect } from 'react';
import { useGetActiveTool } from './useGetActiveTool';

type HookReturnType = (
  update: Partial<Pick<Tool, 'name' | 'components'>>
) => Promise<ApiResponse<Tool> | undefined>;

export const useUpdateActiveTool = (): HookReturnType => {
  const tool = useGetActiveTool();
  const [updateTool, { error }] = useUpdateToolMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (error) {
      dispatch(
        setSnackbarMessage({
          type: 'error',
          message: parseApiError(error),
        })
      );
    }
  }, [error, dispatch]);

  const handleUpdateTool = useCallback(
    async (update: Partial<Pick<Tool, 'name' | 'components'>>) => {
      if (!tool) {
        return undefined;
      }

      return updateTool({
        id: tool.id,
        ...update,
      });
    },
    [tool, updateTool]
  );

  return handleUpdateTool;
};
