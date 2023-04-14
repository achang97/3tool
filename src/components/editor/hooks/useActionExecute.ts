import { ActionResult } from '@app/constants';
import { Action, ActionType } from '@app/types';
import { useCallback } from 'react';
import { useActionHandleResult } from './useActionHandleResult';
import { useActionJavascriptExecute } from './useActionJavascriptExecute';
import { useActionSmartContractExecute } from './useActionSmartContractExecute';
import { useActionTransformer } from './useActionTransformer';

export const useActionExecute = () => {
  const executeJavascript = useActionJavascriptExecute();
  const transformData = useActionTransformer();
  const { readSmartContract, writeSmartContract } = useActionSmartContractExecute();
  const handleResult = useActionHandleResult();

  const executeAction = useCallback(
    async (action: Action): Promise<ActionResult> => {
      const actionData = action.data[action.type];

      let data: unknown;
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
            data = await writeSmartContract(action.data.smartContractWrite);
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
        // eslint-disable-next-line no-console
        console.log(`[Error] ${action.name}:`, e);
        return {
          data,
          error: (e as Error).message,
        };
      }

      return { data };
    },
    [executeJavascript, transformData, readSmartContract, writeSmartContract]
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
