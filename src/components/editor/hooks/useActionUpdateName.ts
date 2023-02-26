import { focusAction } from '@app/redux/features/editorSlice';
import { renameActionResult } from '@app/redux/features/activeToolSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { useCallback } from 'react';
import { ApiSuccessResponse, Tool } from '@app/types';
import { useBaseElementUpdateName } from './useBaseElementUpdateName';
import { ReferenceUpdate } from './useToolUpdateReference';

export const useActionUpdateName = (prevName: string) => {
  const dispatch = useAppDispatch();

  const extendUpdate = useCallback(
    (newName: string, update: ReferenceUpdate) => {
      // Update the name of the actual action
      update.actions = update.actions.map((action) => {
        return action.name === prevName ? { ...action, name: newName } : action;
      });
    },
    [prevName]
  );

  const handleSuccess = useCallback(
    (newName: string, response: ApiSuccessResponse<Tool>) => {
      const updatedAction = response.data.actions.find(
        (action) => action.name === newName
      );

      if (!updatedAction) {
        return;
      }

      // Refocus action
      dispatch(focusAction(updatedAction));
      dispatch(renameActionResult({ prevName, newName }));
    },
    [dispatch, prevName]
  );

  return useBaseElementUpdateName({
    prevName,
    extendUpdate,
    onSuccess: handleSuccess,
  });
};
