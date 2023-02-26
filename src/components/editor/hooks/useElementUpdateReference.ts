import { Action, Component } from '@app/types';
import _ from 'lodash';
import { useCallback } from 'react';
import {
  parseObjectVariable,
  replaceDynamicTermVariableName,
  replaceVariableName,
} from '../utils/javascript';
import {
  FlatElement,
  useElementFlattenFields,
} from './useElementFlattenFields';

export const useElementUpdateReference = () => {
  const flattenElement = useElementFlattenFields({
    includePrefix: false,
    onlyLeaves: true,
  });

  const getEventHandlerTypeMap = useCallback((flatElement: FlatElement) => {
    return _.chain(flatElement.fields)
      .filter((field) => !!field.name.match(/eventHandlers\[\d+\]\.type/))
      .keyBy('parent')
      .mapValues('value')
      .value();
  }, []);

  const updateElement = useCallback(
    <T extends Action | Component>(
      element: T,
      prevName: string,
      newName: string
    ): T => {
      const update: Record<string, unknown> = {};
      const flatElement = flattenElement(element);
      const eventHandlerTypeMap = getEventHandlerTypeMap(flatElement);

      flatElement.fields.forEach((field) => {
        const newFieldVal = field.isJavascript
          ? replaceVariableName(field.value, prevName, newName)
          : replaceDynamicTermVariableName(field.value, prevName, newName);

        if (newFieldVal === field.value) {
          return;
        }

        const { objectName, fieldName } = parseObjectVariable(field.name);
        const isEventField = objectName.match(/eventHandlers\[\d+\]/);

        let fieldKey: string;
        if (isEventField) {
          // Event handler data
          const eventHandlerType = eventHandlerTypeMap[objectName];
          fieldKey = `${objectName}.data.${eventHandlerType}.${fieldName}`;
        } else {
          // Element data object
          fieldKey = `data.${element.type}.${field.name}`;
        }

        _.set(update, fieldKey, newFieldVal);
      });

      return _.merge({}, element, update);
    },
    [flattenElement, getEventHandlerTypeMap]
  );

  return updateElement;
};
