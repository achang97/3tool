import { useAppSelector } from '@app/redux/hooks';
import { useCallback } from 'react';
import { isSuccessfulApiResponse } from '@app/utils/api';
import { ApiResponse, Tool } from '@app/types';
import { useActiveTool } from './useActiveTool';
import { useActionExecute } from './useActionExecute';

type HookReturnType = {
  executeAction: () => void;
  saveAction: () => Promise<ApiResponse<Tool> | undefined>;
  saveAndExecuteAction: () => Promise<void>;
};

export const useActionSaveHandlers = (): HookReturnType => {
  const { tool, updateTool } = useActiveTool();
  const { focusedAction } = useAppSelector((state) => state.editor);
  const baseExecuteAction = useActionExecute();

  const executeAction = useCallback(() => {
    if (!focusedAction) {
      return;
    }
    baseExecuteAction(focusedAction);
  }, [focusedAction, baseExecuteAction]);

  const saveAction = useCallback(async () => {
    return updateTool({
      actions: tool.actions.map((currAction) => {
        return currAction.name === focusedAction?.name
          ? focusedAction
          : currAction;
      }),
    });
  }, [focusedAction, tool.actions, updateTool]);

  const saveAndExecuteAction = useCallback(async () => {
    const response = await saveAction();
    if (!isSuccessfulApiResponse(response)) {
      return;
    }
    executeAction();
  }, [executeAction, saveAction]);

  return {
    executeAction,
    saveAction,
    saveAndExecuteAction,
  };
};
