import { COMPONENT_DATA_TYPES } from '@app/constants';
import {
  BaseComponentInspectorProps,
  Component,
  ComponentType,
} from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

const DATA_TYPES = COMPONENT_DATA_TYPES.text;

export const TextInspector = ({
  name,
  data,
  onChangeData,
}: BaseComponentInspectorProps<ComponentType.Text>) => {
  const config: BaseInspectorSectionProps<Component['data']['text']>[] =
    useMemo(() => {
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
      onChange={onChangeData}
      isAutosaved
      testId="text-inspector"
    />
  );
};
