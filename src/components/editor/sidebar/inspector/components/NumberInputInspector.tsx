import { COMPONENT_DATA_TYPES } from '@app/constants';
import { BaseComponentInspectorProps } from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

const DATA_TYPES = COMPONENT_DATA_TYPES.numberInput;

export const NumberInputInspector = ({
  name,
  data,
  onUpdateData,
}: BaseComponentInspectorProps) => {
  const numberInputData = useMemo(() => {
    return data.numberInput;
  }, [data]);

  const config: BaseInspectorSectionProps[] = useMemo(() => {
    return [
      {
        title: 'Basic',
        fields: [
          {
            field: 'defaultValue',
            label: 'Default Value',
            value: numberInputData?.defaultValue,
            data: {
              text: {
                type: DATA_TYPES.defaultValue,
              },
            },
          },
          {
            field: 'placeholder',
            label: 'Placeholder',
            value: numberInputData?.placeholder,
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
            value: numberInputData?.label,
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
            value: numberInputData?.disabled,
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
            value: numberInputData?.required,
            data: {
              text: {
                type: DATA_TYPES.required,
              },
            },
          },
          {
            field: 'minimum',
            label: 'Minimum',
            value: numberInputData?.minimum,
            data: {
              text: {
                type: DATA_TYPES.minimum,
              },
            },
          },
          {
            field: 'maximum',
            label: 'Maximum',
            value: numberInputData?.maximum,
            data: {
              text: {
                type: DATA_TYPES.maximum,
              },
            },
          },
        ],
      },
    ];
  }, [numberInputData]);

  return (
    <BaseInspector
      name={name}
      config={config}
      onUpdateData={onUpdateData}
      testId="number-input-inspector"
    />
  );
};
