import { COMPONENT_DATA_TYPES } from '@app/constants';
import { BaseComponentInspectorProps, ComponentType } from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

const DATA_TYPES = COMPONENT_DATA_TYPES.button;

export const ButtonInspector = ({
  name,
  data,
  onUpdateData,
}: BaseComponentInspectorProps<ComponentType.Button>) => {
  const config: BaseInspectorSectionProps[] = useMemo(() => {
    return [
      {
        title: 'Basic',
        fields: [
          {
            field: 'text',
            label: 'Text',
            value: data?.text,
            data: {
              text: {
                type: DATA_TYPES.text,
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
            field: 'loading',
            label: 'Loading',
            value: data?.loading,
            data: {
              text: {
                type: DATA_TYPES.loading,
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
      testId="button-inspector"
    />
  );
};
