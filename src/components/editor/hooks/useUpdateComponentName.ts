import {
  focusComponent,
  setSnackbarMessage,
} from '@app/redux/features/editorSlice';
import { renameComponentInput } from '@app/redux/features/activeToolSlice';
import { useAppDispatch } from '@app/redux/hooks';
import { useCallback } from 'react';
import { Component } from '@app/types';
import { isSuccessfulApiResponse } from '@app/utils/api';
import _ from 'lodash';
import {
  flattenComponentDataFields,
  parseComponentFieldName,
  updateDynamicTermComponents,
} from '../utils/components';
import { useActiveTool } from './useActiveTool';

type UpdateComponentNameCallback = (newName: string) => Promise<void>;

export const useUpdateComponentName = (
  name: string
): UpdateComponentNameCallback => {
  const dispatch = useAppDispatch();
  const { tool, updateTool } = useActiveTool();

  const validateName = useCallback((newName: string) => {
    if (!newName.match(/^[\w_$]+$/)) {
      return 'Name can only contain letters, numbers, _, or $';
    }
    return '';
  }, []);

  const updateComponents = useCallback(
    async (newName: string) => {
      const newComponents = tool.components.map((component) => {
        const newComponent: Component = { ...component };
        if (component.name === name) {
          newComponent.name = newName;
        }

        // Replace all dynamic references
        flattenComponentDataFields(component).forEach((field) => {
          const { fieldName } = parseComponentFieldName(field.name);
          if (!field.isLeaf || !fieldName) {
            return;
          }

          const newFieldVal = updateDynamicTermComponents(
            field.value,
            name,
            newName,
            tool.components
          );

          const fieldUpdate = { [fieldName]: newFieldVal };
          _.merge(newComponent.data[component.type], fieldUpdate);
        });

        return newComponent;
      });

      return updateTool({ components: newComponents });
    },
    [name, tool.components, updateTool]
  );

  const handleSubmitName = useCallback(
    async (newName: string) => {
      const errorMessage = validateName(newName);
      if (errorMessage) {
        dispatch(
          setSnackbarMessage({
            type: 'error',
            message: errorMessage,
          })
        );
        return;
      }

      const response = await updateComponents(newName);

      if (!isSuccessfulApiResponse(response)) {
        return;
      }

      // Refocus component and rename component inputs entry
      dispatch(focusComponent(newName));
      dispatch(renameComponentInput({ prevName: name, newName }));
    },
    [validateName, updateComponents, dispatch, name]
  );

  return handleSubmitName;
};
