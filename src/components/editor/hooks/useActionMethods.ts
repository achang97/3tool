import { ActionResult } from '@app/constants';
import { resetActionResult } from '@app/redux/features/activeToolSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { Action, ActionMethod } from '@app/types';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { useActionQueue } from './useActionQueue';
import { useActiveTool } from './useActiveTool';

export const useActionMethods = () => {
  const { tool } = useActiveTool();
  const { enqueueAction } = useActionQueue();
  const dispatch = useAppDispatch();

  const getActionMethods = useCallback(
    (action: Action) => {
      return {
        [ActionMethod.Reset]: () => {
          dispatch(resetActionResult(action.name));
        },
        [ActionMethod.Trigger]: async () => {
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

  const actionMethods = useMemo(() => {
    return _.chain(tool.actions).keyBy('name').mapValues(getActionMethods).value();
  }, [getActionMethods, tool.actions]);

  return actionMethods;
};
