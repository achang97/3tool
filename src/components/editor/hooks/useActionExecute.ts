import { ActionResult } from '@app/constants';
import { Action, ActionType } from '@app/types';
import { useCallback } from 'react';
import { useAppDispatch } from '@app/redux/hooks';
import { startActionExecute } from '@app/redux/features/activeToolSlice';
import { useActionHandleResult } from './useActionHandleResult';
import { useActionJavascriptExecute } from './useActionJavascriptExecute';
import { useActionSmartContractExecute } from './useActionSmartContractExecute';
import { useActionTransformer } from './useActionTransformer';
import { useToolAnalyticsTrack } from './useToolAnalyticsTrack';
import { useToolMode } from './useToolMode';

export const useActionExecute = () => {
  const executeJavascript = useActionJavascriptExecute();
  const transformData = useActionTransformer();
  const { readSmartContract, writeSmartContract } = useActionSmartContractExecute();
  const handleResult = useActionHandleResult();
  const track = useToolAnalyticsTrack();
  const mode = useToolMode();
  const dispatch = useAppDispatch();

  const executeAction = useCallback(
    async (action: Action): Promise<ActionResult> => {
      const startTime = Date.now();
      const actionData = action.data[action.type];

      let data: unknown;
      let error: string | undefined;
      try {
        switch (action.type) {
          case ActionType.Javascript: {
            data = await executeJavascript(action.data.javascript?.code ?? '');
            break;
          }
          case ActionType.SmartContractRead: {
            data = await readSmartContract(action.data.smartContractRead);
            break;
          }
          case ActionType.SmartContractWrite: {
            data = await writeSmartContract(action.name, action.data.smartContractWrite);
            break;
          }
          default:
            data = undefined;
            break;
        }

        if (actionData) {
          data = await transformData(actionData, data);
        }

        // eslint-disable-next-line no-console
        console.log(`[Success] ${action.name}:`, data);
      } catch (e) {
        error = (e as Error).message;
        // eslint-disable-next-line no-console
        console.log(`[Error] ${action.name}:`, e);
      }

      return {
        data,
        error,
        isLoading: false,
        runtime: Date.now() - startTime,
      };
    },
    [executeJavascript, transformData, readSmartContract, writeSmartContract]
  );

  const execute = useCallback(
    async (action: Action) => {
      dispatch(startActionExecute(action.name));
      track('Action Start', {
        mode,
        actionType: action.type,
        actionId: action._id,
        actionName: action.name,
      });

      const result = await executeAction(action);

      track('Action Complete', {
        mode,
        actionType: action.type,
        actionId: action._id,
        actionName: action.name,
        runtime: result.runtime,
        result: result.error ? 'failure' : 'success',
      });
      handleResult(action, result);

      return result;
    },
    [dispatch, executeAction, handleResult, mode, track]
  );

  return execute;
};
