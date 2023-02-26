import { focusAction, focusComponent } from '@app/redux/features/editorSlice';
import { renameComponentInput } from '@app/redux/features/activeToolSlice';
import { useAppDispatch, useAppSelector } from '@app/redux/hooks';
import { useCallback } from 'react';
import { useBaseElementUpdateName } from './useBaseElementUpdateName';
import { ReferenceUpdate } from './useToolUpdateReference';
import { useElementUpdateReference } from './useElementUpdateReference';

export const useComponentUpdateName = (prevName: string) => {
  const dispatch = useAppDispatch();
  const { focusedAction } = useAppSelector((state) => state.editor);
  const updateElementReference = useElementUpdateReference();

  const extendUpdate = useCallback(
    (newName: string, update: ReferenceUpdate) => {
      // Update the name of the actual component
      update.components = update.components.map((component) => {
        return component.name === prevName
          ? { ...component, name: newName }
          : component;
      });
    },
    [prevName]
  );

  const handleSuccess = useCallback(
    (newName: string) => {
      // Refocus component and rename component inputs entry
      dispatch(focusComponent(newName));
      dispatch(renameComponentInput({ prevName, newName }));

      if (focusedAction) {
        const updatedAction = updateElementReference(
          focusedAction,
          prevName,
          newName
        );
        dispatch(focusAction(updatedAction));
      }
    },
    [dispatch, prevName, focusedAction, updateElementReference]
  );

  return useBaseElementUpdateName({
    prevName,
    extendUpdate,
    onSuccess: handleSuccess,
  });
};
