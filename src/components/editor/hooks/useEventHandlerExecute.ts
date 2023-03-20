import { EVENT_HANDLER_DATA_TYPES } from '@app/constants';
import { EventHandler, EventHandlerType, FieldType } from '@app/types';
import { useCallback } from 'react';
import { evalDynamicExpression } from '../utils/eval';
import { utils } from '../utils/public';
import { useActionMethods } from './useActionMethods';
import { useEvalArgs } from './useEvalArgs';

export const useEventHandlerExecute = () => {
  const actionMethods = useActionMethods();
  const { dynamicEvalArgs } = useEvalArgs();

  const evalValue = useCallback(
    (value: string, fieldType: FieldType) => {
      return evalDynamicExpression(value, fieldType, dynamicEvalArgs);
    },
    [dynamicEvalArgs]
  );

  const executeAction = useCallback(
    (data: EventHandler['data']['action']) => {
      if (!data) {
        return;
      }
      const { actionName, method } = data;
      const methods = actionMethods[actionName];
      methods?.[method]();
    },
    [actionMethods]
  );

  const executeUrl = useCallback(
    (data: EventHandler['data']['url']) => {
      if (!data) {
        return;
      }
      const { url, newTab } = data;
      const { value: evalUrl } = evalValue(
        url,
        EVENT_HANDLER_DATA_TYPES.url.url
      );
      utils.openUrl(evalUrl?.toString() ?? '', { newTab });
    },
    [evalValue]
  );

  const executeEventHandler = useCallback(
    (eventHandler: EventHandler) => {
      switch (eventHandler.type) {
        case EventHandlerType.Action: {
          executeAction(eventHandler.data.action);
          break;
        }
        case EventHandlerType.Url: {
          executeUrl(eventHandler.data.url);
          break;
        }
        default:
          break;
      }
    },
    [executeAction, executeUrl]
  );

  return executeEventHandler;
};
