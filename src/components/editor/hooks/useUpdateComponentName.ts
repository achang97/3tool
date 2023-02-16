import { focusComponent } from '@app/redux/features/editorSlice';
import { renameComponentInput } from '@app/redux/features/activeToolSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { useCallback } from 'react';
import { useUpdateElementName } from './useUpdateElementName';
import { ReferenceUpdate } from './useElementReferenceUpdate';

export const useUpdateComponentName = (prevName: string) => {
  const dispatch = useAppDispatch();

  const extendUpdate = useCallback(
    (newName: string, update: ReferenceUpdate) => {
      // Update the name of the actual component
      update.components = update.components.map((component) => {
        if (component.name !== prevName) {
          return component;
        }
        return { ...component, name: newName };
      });
    },
    [prevName]
  );

  const handleSuccess = useCallback(
    (newName: string) => {
      // Refocus component and rename component inputs entry
      dispatch(focusComponent(newName));
      dispatch(renameComponentInput({ prevName, newName }));
    },
    [dispatch, prevName]
  );

  return useUpdateElementName({
    prevName,
    extendUpdate,
    onSuccess: handleSuccess,
  });
};
