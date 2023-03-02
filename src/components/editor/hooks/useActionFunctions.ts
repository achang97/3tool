import { ActionResult } from '@app/constants';
import { resetActionResult } from '@app/redux/features/activeToolSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { Action } from '@app/types';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { useActionQueue } from './useActionQueue';
import { useActiveTool } from './useActiveTool';

export const useActionFunctions = () => {
  const { tool } = useActiveTool();
  const { enqueueAction } = useActionQueue();
  const dispatch = useAppDispatch();

  const getActionFunctions = useCallback(
    (action: Action) => {
      return {
        reset: () => {
          dispatch(resetActionResult(action.name));
        },
        trigger: async () => {
          return new Promise((res) => {
            enqueueAction(action, (result: ActionResult) => {
              res(result.data);
            });
          });
        },
      };
    },
    [dispatch, enqueueAction]
  );

  const actionFunctions = useMemo(() => {
    return _.chain(tool.actions)
      .keyBy('name')
      .mapValues(getActionFunctions)
      .value();
  }, [getActionFunctions, tool.actions]);

  return actionFunctions;
};
