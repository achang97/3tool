import { COMPONENT_DATA_TYPES } from '@app/constants';
import { BaseComponentInspectorProps } from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

const DATA_TYPES = COMPONENT_DATA_TYPES.textInput;

export const TextInputInspector = ({
  name,
  data,
  onUpdateData,
}: BaseComponentInspectorProps) => {
  const textInputData = useMemo(() => {
    return data.textInput;
  }, [data]);

  const config: BaseInspectorSectionProps[] = useMemo(() => {
    return [
      {
        title: 'Basic',
        fields: [
          {
            field: 'defaultValue',
            label: 'Default Value',
            value: textInputData?.defaultValue,
            data: {
              text: {
                type: DATA_TYPES.defaultValue,
              },
            },
          },
          {
            field: 'placeholder',
            label: 'Placeholder',
            value: textInputData?.placeholder,
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
            value: textInputData?.label,
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
            value: textInputData?.disabled,
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
            value: textInputData?.required,
            data: {
              text: {
                type: DATA_TYPES.required,
              },
            },
          },
          {
            field: 'minLength',
            label: 'Min Length',
            value: textInputData?.minLength,
            data: {
              text: {
                type: DATA_TYPES.minLength,
              },
            },
          },
          {
            field: 'maxLength',
            label: 'Max Length',
            value: textInputData?.maxLength,
            data: {
              text: {
                type: DATA_TYPES.maxLength,
              },
            },
          },
        ],
      },
    ];
  }, [textInputData]);

  return (
    <BaseInspector
      name={name}
      config={config}
      onUpdateData={onUpdateData}
      testId="text-input-inspector"
    />
  );
};
