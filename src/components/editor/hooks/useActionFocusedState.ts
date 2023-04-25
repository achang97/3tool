import { useAppSelector } from '@app/redux/hooks';
import { useCallback, useMemo } from 'react';
import _ from 'lodash';
import { Action } from '@app/types';
import { useActiveTool } from './useActiveTool';

export const useActionFocusedState = () => {
  const { tool } = useActiveTool();
  const { focusedAction } = useAppSelector((state) => state.editor);
  const { actionResults } = useAppSelector((state) => state.activeTool);

  const parseAction = useCallback((action: Action | undefined) => {
    return {
      ..._.pick(action, ['type', 'data']),
      eventHandlers: action?.eventHandlers.map((eventHandler) =>
        _.pick(eventHandler, ['type', 'event', 'data'])
      ),
    };
  }, []);

  const isEditing = useMemo(() => {
    const savedAction = tool.actions.find((action) => action.name === focusedAction?.name);
    return !_.isEqual(parseAction(savedAction), parseAction(focusedAction));
  }, [focusedAction, parseAction, tool.actions]);

  const isLoading = useMemo(() => {
    if (!focusedAction) {
      return false;
    }
    const actionState = actionResults[focusedAction.name];
    return !!actionState?.isLoading;
  }, [actionResults, focusedAction]);

  return { isEditing, isLoading };
};
