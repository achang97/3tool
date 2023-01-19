import { setSnackbarMessage } from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { useUpdateToolMutation } from '@app/redux/services/tools';
import { parseApiError } from '@app/utils/api';
import { useEffect } from 'react';

type HookReturnType = ReturnType<typeof useUpdateToolMutation>[0];

export const useUpdateActiveTool = (): HookReturnType => {
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

  return updateTool;
};
