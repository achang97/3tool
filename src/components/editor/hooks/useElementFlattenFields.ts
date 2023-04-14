import {
  ACTION_DATA_JAVASCRIPT_FLAGS,
  ACTION_DATA_TYPES,
  COMPONENT_DATA_TYPES,
  EVENT_HANDLER_DATA_TYPES,
} from '@app/constants';
import { EVENT_HANDLER_DATA_JAVASCRIPT_FLAGS } from '@app/constants/eventHandlers/javascriptFlags';
import { Action, Component, EventHandler, FieldType } from '@app/types';
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

export const useElementFlattenFields = ({ includePrefix, onlyLeaves }: HookArgs) => {
  const getFlattenOptions = useCallback(
    (prefix: string) => {
      return {
        prefix: includePrefix ? prefix : '',
        onlyLeaves,
      };
    },
    [includePrefix, onlyLeaves]
  );

  const extendFieldsWithEvalType = useCallback(
    (
      prefix: string,
      fields: FlatField[],
      typeMaps: {
        evalTypes: Record<string, unknown>;
        javascriptFlags?: Record<string, unknown>;
      }
    ) => {
      return fields.map((field) => {
        const fieldKey = includePrefix ? field.name.split(`${prefix}.`)[1] : field.name;

        const evalType = _.get(typeMaps.evalTypes, fieldKey, 'any');
        const isJavascript = _.get(typeMaps.javascriptFlags, fieldKey) === true;

        return {
          ...field,
          // NOTE: We can probably improve this by converting FieldType into a enum.
          evalType: typeof evalType === 'string' ? (evalType as FieldType) : 'any',
          isJavascript,
        };
      });
    },
    [includePrefix]
  );

  const flattenEventHandlers = useCallback(
    (element: Action | Component) => {
      const createEventHandlerObject = (callback: (eventHandler: EventHandler) => void) => ({
        eventHandlers: element.eventHandlers.map(callback),
      });

      const eventsObject = createEventHandlerObject((eventHandler) => ({
        ..._.omit(eventHandler, 'data'),
        ...eventHandler.data[eventHandler.type],
      }));
      const fields = flattenObjectFields(eventsObject, getFlattenOptions(element.name));

      const typeMaps = {
        evalTypes: createEventHandlerObject(
          (eventHandler) => EVENT_HANDLER_DATA_TYPES[eventHandler.type]
        ),
        javascriptFlags: createEventHandlerObject(
          (eventHandler) => EVENT_HANDLER_DATA_JAVASCRIPT_FLAGS[eventHandler.type]
        ),
      };

      return _.flatten(extendFieldsWithEvalType(element.name, fields, typeMaps));
    },
    [extendFieldsWithEvalType, getFlattenOptions]
  );

  const flattenData = useCallback(
    (element: Action | Component) => {
      const data = getElementData(element);
      const typeMaps = isAction(element)
        ? {
            evalTypes: ACTION_DATA_TYPES[element.type],
            javascriptFlags: ACTION_DATA_JAVASCRIPT_FLAGS[element.type],
          }
        : {
            evalTypes: COMPONENT_DATA_TYPES[element.type],
          };
      const fields = flattenObjectFields(data, getFlattenOptions(element.name));
      return extendFieldsWithEvalType(element.name, fields, typeMaps);
    },
    [extendFieldsWithEvalType, getFlattenOptions]
  );

  const flattenElement = useCallback(
    <T extends Action | Component>(element: T): FlatElement => {
      const dataFields = flattenData(element);
      const eventHandlerFields = flattenEventHandlers(element);

      return {
        name: element.name,
        fields: [...dataFields, ...eventHandlerFields],
      };
    },
    [flattenData, flattenEventHandlers]
  );

  return flattenElement;
};
