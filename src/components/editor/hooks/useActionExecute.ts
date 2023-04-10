import { ActionResult } from '@app/constants';
import { Action, ActionType } from '@app/types';
import { useCallback } from 'react';
import { asyncEvalWithArgs } from '../utils/eval';
import { useActionHandleResult } from './useActionHandleResult';
import { useEvalArgs } from './useEvalArgs';

export const useActionExecute = () => {
  // NOTE: We need to use the dynamicEvalArgs to evaluate other action types in the future.
  const { staticEvalArgs } = useEvalArgs();
  const handleResult = useActionHandleResult();

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
          data = await asyncEvalWithArgs(transformer, { ...staticEvalArgs, data }, true);
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
      handleResult(action, result);
      return result;
    },
    [executeAction, handleResult]
  );

  return execute;
};
