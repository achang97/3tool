import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { BaseComponentInspectorProps, ComponentType } from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

export const NumberInputInspector = ({
  name,
  data,
  onUpdate,
}: BaseComponentInspectorProps) => {
  const { evalData } = useComponentEvalData<ComponentType.NumberInput>(name);

  const numberInputData = useMemo(() => {
    return data[ComponentType.NumberInput];
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
                evalResult: evalData.defaultValue,
              },
            },
          },
          {
            field: 'placeholder',
            label: 'Placeholder',
            value: numberInputData?.placeholder,
            data: {
              text: {
                evalResult: evalData.placeholder,
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
                evalResult: evalData.label,
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
                evalResult: evalData.disabled,
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
                evalResult: evalData.required,
              },
            },
          },
          {
            field: 'minimum',
            label: 'Minimum',
            value: numberInputData?.minimum,
            data: {
              text: {
                evalResult: evalData.minimum,
              },
            },
          },
          {
            field: 'maximum',
            label: 'Maximum',
            value: numberInputData?.maximum,
            data: {
              text: {
                evalResult: evalData.maximum,
              },
            },
          },
        ],
      },
    ];
  }, [evalData, numberInputData]);

  return (
    <BaseInspector
      type={ComponentType.NumberInput}
      name={name}
      config={config}
      onUpdate={onUpdate}
      testId="number-input-inspector"
    />
  );
};
