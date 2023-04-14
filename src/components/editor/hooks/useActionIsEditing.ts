import { useAppSelector } from '@app/redux/hooks';
import { useCallback, useMemo } from 'react';
import _ from 'lodash';
import { Action } from '@app/types';
import { useActiveTool } from './useActiveTool';

export const useActionIsEditing = () => {
  const { tool } = useActiveTool();
  const { focusedAction } = useAppSelector((state) => state.editor);

  const savedAction = useMemo(() => {
    return tool.actions.find((action) => action.name === focusedAction?.name);
  }, [focusedAction?.name, tool.actions]);

  const parseAction = useCallback((action: Action | undefined) => {
    return JSON.parse(JSON.stringify(_.pick(action, ['type', 'data', 'eventHandlers'])));
  }, []);

  const isEditing = useMemo(() => {
    return !_.isEqual(parseAction(savedAction), parseAction(focusedAction));
  }, [focusedAction, parseAction, savedAction]);

  return isEditing;
};
