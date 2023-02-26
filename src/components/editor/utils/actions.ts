import { ActionResult } from '@app/constants/actions';
import { Action, ActionType } from '@app/types';
import { evalWithArgs } from './eval';

export const executeAction = (
  action: Action,
  args: Record<string, unknown>
): ActionResult => {
  let data: unknown;
  try {
    switch (action.type) {
      case ActionType.Javascript: {
        data = evalWithArgs(action.data.javascript?.code ?? '', args, true);
        break;
      }
      default:
        data = undefined;
        break;
    }

    const transformer = action.data[action.type]?.transformer;
    if (transformer) {
      data = evalWithArgs(transformer, { ...args, data }, true);
    }
  } catch (e) {
    return {
      data,
      error: (e as Error).message,
    };
  }

  return { data };
};
