import { setActionResult } from '@app/redux/features/activeToolSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { Action } from '@app/types';
import { useCallback } from 'react';
import { executeAction } from '../utils/actions';
import { useEnqueueSnackbar } from './useEnqueueSnackbar';
import { useEvalArgs } from './useEvalArgs';

export const useActionExecute = () => {
  const enqueueSnackbar = useEnqueueSnackbar();
  const dispatch = useAppDispatch();
  const evalArgs = useEvalArgs();

  const handleExecuteAction = useCallback(
    (action: Action) => {
      const result = executeAction(action, evalArgs);
      dispatch(setActionResult({ name: action.name, result }));

      if (result.error) {
        enqueueSnackbar(`Failed to execute ${action.name}`, {
          variant: 'error',
        });
        return;
      }

      enqueueSnackbar(`Executed ${action.name}`, {
        variant: 'success',
      });
    },
    [dispatch, enqueueSnackbar, evalArgs]
  );

  return handleExecuteAction;
};
