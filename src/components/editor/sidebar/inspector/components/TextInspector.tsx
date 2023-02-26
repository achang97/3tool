import { COMPONENT_DATA_TYPES } from '@app/constants';
import { BaseComponentInspectorProps } from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

const DATA_TYPES = COMPONENT_DATA_TYPES.text;

export const TextInspector = ({
  name,
  data,
  onUpdateData,
}: BaseComponentInspectorProps) => {
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
  }, [textData]);

  return (
    <BaseInspector
      name={name}
      config={config}
      onUpdateData={onUpdateData}
      testId="text-inspector"
    />
  );
};
