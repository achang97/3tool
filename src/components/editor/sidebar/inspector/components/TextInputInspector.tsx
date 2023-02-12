import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { BaseComponentInspectorProps, ComponentType } from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

export const TextInputInspector = ({
  name,
  data,
  onUpdate,
}: BaseComponentInspectorProps) => {
  const { evalData } = useComponentEvalData<ComponentType.TextInput>(name);

  const textInputData = useMemo(() => {
    return data[ComponentType.TextInput];
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
                evalResult: evalData.defaultValue,
              },
            },
          },
          {
            field: 'placeholder',
            label: 'Placeholder',
            value: textInputData?.placeholder,
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
            value: textInputData?.label,
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
            value: textInputData?.disabled,
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
            value: textInputData?.required,
            data: {
              text: {
                evalResult: evalData.required,
              },
            },
          },
          {
            field: 'minLength',
            label: 'Min Length',
            value: textInputData?.minLength,
            data: {
              text: {
                evalResult: evalData.minLength,
              },
            },
          },
          {
            field: 'maxLength',
            label: 'Max Length',
            value: textInputData?.maxLength,
            data: {
              text: {
                evalResult: evalData.maxLength,
              },
            },
          },
        ],
      },
    ];
  }, [evalData, textInputData]);

  return (
    <BaseInspector
      type={ComponentType.TextInput}
      name={name}
      config={config}
      onUpdate={onUpdate}
      testId="text-input-inspector"
    />
  );
};
