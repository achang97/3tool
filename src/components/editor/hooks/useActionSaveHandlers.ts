import { useAppSelector } from '@app/redux/hooks';
import { useCallback } from 'react';
import { Tool } from '@app/types';
import { useActiveTool } from './useActiveTool';
import { useActionExecute } from './useActionExecute';

type HookReturnType = {
  executeAction: () => void;
  saveAction: () => Promise<Tool | undefined>;
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
        return currAction.name === focusedAction?.name ? focusedAction : currAction;
      }),
    });
  }, [focusedAction, tool.actions, updateTool]);

  const saveAndExecuteAction = useCallback(async () => {
    const response = await saveAction();
    if (!response) {
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
