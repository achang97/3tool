import {
  ACTION_DATA_JAVASCRIPT_FLAGS,
  ACTION_DATA_TYPES,
  COMPONENT_DATA_TYPES,
  EVENT_HANDLER_DATA_TYPES,
} from '@app/constants';
import { Action, Component, FieldType } from '@app/types';
import _ from 'lodash';
import { useCallback } from 'react';
import { getElementData, isAction } from '../utils/elements';
import { FlatField, flattenObjectFields } from '../utils/javascript';

type HookArgs = {
  includePrefix: boolean;
  onlyLeaves: boolean;
};

export type ExtendedFlatField = FlatField & {
  evalType: FieldType;
  isJavascript: boolean;
};

export type FlatElement = {
  name: string;
  fields: ExtendedFlatField[];
};

export const useElementFlattenFields = ({
  includePrefix,
  onlyLeaves,
}: HookArgs) => {
  const getFlattenOptions = useCallback(
    (element: Action | Component) => {
      return {
        prefix: includePrefix ? element.name : '',
        onlyLeaves,
      };
    },
    [includePrefix, onlyLeaves]
  );

  const extendFieldsWithEvalType = useCallback(
    (
      element: Action | Component,
      fields: FlatField[],
      evalTypes: Record<string, unknown>,
      javascriptFlags: Record<string, unknown> = {}
    ) => {
      const { prefix } = getFlattenOptions(element);
      return fields.map((field) => {
        const fieldKey = prefix
          ? field.name.split(`${prefix}.`)[1]
          : field.name;

        const evalType = _.get(evalTypes, fieldKey, 'any');
        const isJavascript = _.get(javascriptFlags, fieldKey) === true;

        return {
          ...field,
          // NOTE: We can probably improve this by converting FieldType into a enum.
          evalType:
            typeof evalType === 'string' ? (evalType as FieldType) : 'any',
          isJavascript,
        };
      });
    },
    [getFlattenOptions]
  );

  const flattenEventHandlerFields = useCallback(
    (element: Action | Component) => {
      const eventsObject = {
        eventHandlers: element.eventHandlers.map((eventHandler) => ({
          ..._.omit(eventHandler, 'data'),
          ...eventHandler.data[eventHandler.type],
        })),
      };
      const fields = flattenObjectFields(
        eventsObject,
        getFlattenOptions(element)
      );

      const evalFieldTypes = {
        eventHandlers: element.eventHandlers.map(
          (eventHandler) => EVENT_HANDLER_DATA_TYPES[eventHandler.type]
        ),
      };
      return extendFieldsWithEvalType(element, fields, evalFieldTypes);
    },
    [extendFieldsWithEvalType, getFlattenOptions]
  );

  const getElementTypeMaps = useCallback((element: Action | Component) => {
    if (isAction(element)) {
      return {
        evalTypes: ACTION_DATA_TYPES[element.type],
        javascriptFlags: ACTION_DATA_JAVASCRIPT_FLAGS[element.type],
      };
    }

    // isComponent(element)
    return {
      evalTypes: COMPONENT_DATA_TYPES[element.type],
    };
  }, []);

  const flattenElement = useCallback(
    <T extends Action | Component>(element: T): FlatElement => {
      const data = getElementData(element);
      const typeMaps = getElementTypeMaps(element);
      const fields = flattenObjectFields(data, getFlattenOptions(element));

      const dataFields = extendFieldsWithEvalType(
        element,
        fields,
        typeMaps.evalTypes,
        typeMaps.javascriptFlags
      );
      const eventHandlerFields = _.flatten(flattenEventHandlerFields(element));

      return {
        name: element.name,
        fields: [...dataFields, ...eventHandlerFields],
      };
    },
    [
      getElementTypeMaps,
      getFlattenOptions,
      extendFieldsWithEvalType,
      flattenEventHandlerFields,
    ]
  );

  return flattenElement;
};
