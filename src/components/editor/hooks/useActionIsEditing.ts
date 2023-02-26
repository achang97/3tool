import { useAppSelector } from '@app/redux/hooks';
import _ from 'lodash';
import { useMemo } from 'react';
import { useActiveTool } from './useActiveTool';

export const useActionIsEditing = () => {
  const { tool } = useActiveTool();
  const { focusedAction } = useAppSelector((state) => state.editor);

  const savedAction = useMemo(() => {
    return tool.actions.find((action) => action.name === focusedAction?.name);
  }, [focusedAction?.name, tool.actions]);

  const isEditing = useMemo(() => {
    return !_.isEqual(savedAction, focusedAction);
  }, [focusedAction, savedAction]);

  return isEditing;
};
