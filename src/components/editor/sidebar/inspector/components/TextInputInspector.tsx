import { COMPONENT_DATA_TYPES } from '@app/constants';
import { BaseComponentInspectorProps, ComponentType } from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

const DATA_TYPES = COMPONENT_DATA_TYPES.textInput;

export const TextInputInspector = ({
  data,
  onUpdateData,
}: BaseComponentInspectorProps<ComponentType.TextInput>) => {
  const config: BaseInspectorSectionProps[] = useMemo(() => {
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
            field: 'minLength',
            label: 'Min Length',
            value: data?.minLength,
            data: {
              text: {
                type: DATA_TYPES.minLength,
              },
            },
          },
          {
            field: 'maxLength',
            label: 'Max Length',
            value: data?.maxLength,
            data: {
              text: {
                type: DATA_TYPES.maxLength,
              },
            },
          },
        ],
      },
    ];
  }, [data]);

  return (
    <BaseInspector
      config={config}
      onUpdateData={onUpdateData}
      testId="text-input-inspector"
    />
  );
};
