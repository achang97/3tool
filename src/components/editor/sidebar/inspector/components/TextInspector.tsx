import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { BaseComponentInspectorProps, ComponentType } from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

export const TextInspector = ({
  name,
  data,
  onUpdate,
}: BaseComponentInspectorProps) => {
  const { evalData } = useComponentEvalData<ComponentType.Text>(name);

  const textData = useMemo(() => {
    return data.text;
  }, [data]);

  const config: BaseInspectorSectionProps[] = useMemo(() => {
    return [
      {
        title: 'Basic',
        fields: [
          {
            field: 'value',
            label: 'Value',
            value: textData?.value,
            data: {
              text: {
                evalResult: evalData.value,
              },
            },
          },
        ],
      },
      {
        title: 'Layout',
        fields: [
          {
            field: 'horizontalAlignment',
            label: 'Horizontal Alignment',
            value: textData?.horizontalAlignment,
            data: {
              enum: {
                options: [
                  {
                    label: 'Left',
                    value: 'left',
                  },
                  {
                    label: 'Center',
                    value: 'center',
                  },
                  {
                    label: 'Right',
                    value: 'right',
                  },
                ],
              },
            },
          },
        ],
      },
    ];
  }, [evalData, textData]);

  return (
    <BaseInspector
      type={ComponentType.Text}
      name={name}
      config={config}
      onUpdate={onUpdate}
      testId="text-inspector"
    />
  );
};
