import { ActionResult } from '@app/constants';
import { setActionResult } from '@app/redux/features/activeToolSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { Action, ActionType } from '@app/types';
import { useCallback } from 'react';
import { asyncEvalWithArgs } from '../utils/eval';
import { useEnqueueSnackbar } from './useEnqueueSnackbar';
import { useEvalArgs } from './useEvalArgs';

export const useActionExecute = () => {
  const enqueueSnackbar = useEnqueueSnackbar();
  const dispatch = useAppDispatch();
  // NOTE: We need to use the dynamicEvalArgs to evaluate other action types in the future.
  const { staticEvalArgs } = useEvalArgs();

  const handleResult = useCallback(
    (name: string, result: ActionResult) => {
      dispatch(setActionResult({ name, result }));

      if (result.error) {
        enqueueSnackbar(`Failed to execute ${name}`, {
          variant: 'error',
        });
        return;
      }

      enqueueSnackbar(`Executed ${name}`, {
        variant: 'success',
      });
    },
    [dispatch, enqueueSnackbar]
  );

  const executeAction = useCallback(
    async (action: Action): Promise<ActionResult> => {
      let data: unknown;
      try {
        switch (action.type) {
          case ActionType.Javascript: {
            data = await asyncEvalWithArgs(
              action.data.javascript?.code ?? '',
              staticEvalArgs,
              true
            );
            break;
          }
          default:
            data = undefined;
            break;
        }

        const transformer = action.data[action.type]?.transformer;
        if (transformer) {
          data = await asyncEvalWithArgs(
            transformer,
            { ...staticEvalArgs, data },
            true
          );
        }
      } catch (e) {
        return {
          data,
          error: (e as Error).message,
        };
      }

      return { data };
    },
    [staticEvalArgs]
  );

  const execute = useCallback(
    async (action: Action) => {
      const result = await executeAction(action);
      handleResult(action.name, result);
      return result;
    },
    [executeAction, handleResult]
  );

  return execute;
};
