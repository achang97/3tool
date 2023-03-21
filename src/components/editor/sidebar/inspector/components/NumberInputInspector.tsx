import { COMPONENT_CONFIGS, COMPONENT_DATA_TYPES } from '@app/constants';
import {
  BaseComponentInspectorProps,
  Component,
  ComponentType,
} from '@app/types';
import { useMemo } from 'react';
import { ComponentEventHandlers } from '../ComponentEventHandlers';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

const DATA_TYPES = COMPONENT_DATA_TYPES.numberInput;
const NUMBER_INPUT_CONFIG = COMPONENT_CONFIGS.numberInput;

export const NumberInputInspector = ({
  name,
  data,
  eventHandlers,
  onChangeData,
  onChangeEventHandlers,
}: BaseComponentInspectorProps<ComponentType.NumberInput>) => {
  const config: BaseInspectorSectionProps<Component['data']['numberInput']>[] =
    useMemo(() => {
      return [
        {
          title: 'Basic',
          fields: [
            {
              field: 'defaultValue',
              label: 'Default Value',
              value: data?.defaultValue,
              data: {
                text: {
                  type: DATA_TYPES.defaultValue,
                },
              },
            },
            {
              field: 'placeholder',
              label: 'Placeholder',
              value: data?.placeholder,
              data: {
                text: {
                  type: DATA_TYPES.placeholder,
                },
              },
            },
          ],
        },
        {
          title: 'Label',
          fields: [
            {
              field: 'label',
              label: 'Label',
              value: data?.label,
              data: {
                text: {
                  type: DATA_TYPES.label,
                },
              },
            },
          ],
        },
        {
          title: 'Interaction',
          fields: [
            {
              field: 'disabled',
              label: 'Disabled',
              value: data?.disabled,
              data: {
                text: {
                  type: DATA_TYPES.disabled,
                },
              },
            },
            {
              field: 'eventHandlers',
              component: (
                <ComponentEventHandlers
                  name={name}
                  eventHandlers={eventHandlers}
                  eventOptions={NUMBER_INPUT_CONFIG.events}
                  onChange={onChangeEventHandlers}
                />
              ),
            },
          ],
        },
        {
          title: 'Validation',
          fields: [
            {
              field: 'required',
              label: 'Required',
              value: data?.required,
              data: {
                text: {
                  type: DATA_TYPES.required,
                },
              },
            },
            {
              field: 'minimum',
              label: 'Minimum',
              value: data?.minimum,
              data: {
                text: {
                  type: DATA_TYPES.minimum,
                },
              },
            },
            {
              field: 'maximum',
              label: 'Maximum',
              value: data?.maximum,
              data: {
                text: {
                  type: DATA_TYPES.maximum,
                },
              },
            },
          ],
        },
      ];
    }, [data, eventHandlers, name, onChangeEventHandlers]);

  return (
    <BaseInspector
      name={name}
      config={config}
      onChange={onChangeData}
      testId="number-input-inspector"
    />
  );
};
