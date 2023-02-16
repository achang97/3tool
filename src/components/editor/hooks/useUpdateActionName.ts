import { focusAction } from '@app/redux/features/editorSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { useCallback } from 'react';
import { useUpdateElementName } from './useUpdateElementName';
import { ReferenceUpdate } from './useElementReferenceUpdate';

export const useUpdateActionName = (prevName: string) => {
  const dispatch = useAppDispatch();

  const extendUpdate = useCallback(
    (newName: string, update: ReferenceUpdate) => {
      // Update the name of the actual action
      update.actions = update.actions.map((action) => {
        if (action.name !== prevName) {
          return action;
        }
        return { ...action, name: newName };
      });
    },
    [prevName]
  );

  const handleSuccess = useCallback(
    (newName: string) => {
      // Refocus action
      dispatch(focusAction(newName));
    },
    [dispatch]
  );

  return useUpdateElementName({
    prevName,
    extendUpdate,
    onSuccess: handleSuccess,
  });
};
