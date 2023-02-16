import { Component, Tool } from '@app/types';
import _ from 'lodash';
import { useCallback } from 'react';
import { getComponentData } from '../utils/components';
import {
  flattenObjectFields,
  replaceDynamicTermVariableName,
} from '../utils/javascript';
import { useActiveTool } from './useActiveTool';

export type ReferenceUpdate = Pick<Tool, 'components' | 'actions'>;

export const useElementReferenceUpdate = (prevName: string) => {
  const { tool } = useActiveTool();

  const updateComponents = useCallback(
    (newName: string) => {
      return tool.components.map((component) => {
        const newComponent: Component = { ...component };

        flattenObjectFields(getComponentData(component)).forEach((field) => {
          const newFieldVal = replaceDynamicTermVariableName(
            field.value,
            prevName,
            newName
          );
          newComponent.data = _.merge({}, newComponent.data, {
            [newComponent.type]: {
              [field.name]: newFieldVal,
            },
          });
        });

        return newComponent;
      });
    },
    [prevName, tool.components]
  );

  const updateActions = useCallback(() => {
    // TODO: Loop through action fields and replace variables
    return tool.actions;
  }, [tool.actions]);

  const createElementReferenceUpdate = useCallback(
    (newName: string): ReferenceUpdate => {
      return {
        components: updateComponents(newName),
        actions: updateActions(),
      };
    },
    [updateActions, updateComponents]
  );

  return createElementReferenceUpdate;
};
