import { COMPONENT_DATA_TYPES } from '@app/constants';
import { BaseComponentInspectorProps, ComponentType } from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

const DATA_TYPES = COMPONENT_DATA_TYPES.text;

export const TextInspector = ({
  name,
  data,
  onUpdateData,
}: BaseComponentInspectorProps<ComponentType.Text>) => {
  const config: BaseInspectorSectionProps[] = useMemo(() => {
    return [
      {
        title: 'Basic',
        fields: [
          {
            field: 'value',
            label: 'Value',
            value: data?.value,
            data: {
              text: {
                type: DATA_TYPES.value,
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
            value: data?.horizontalAlignment,
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
  }, [data]);

  return (
    <BaseInspector
      name={name}
      config={config}
      onUpdateData={onUpdateData}
      testId="text-inspector"
    />
  );
};
