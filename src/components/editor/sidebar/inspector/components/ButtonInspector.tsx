import { COMPONENT_DATA_TYPES } from '@app/constants';
import { BaseComponentInspectorProps } from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

const DATA_TYPES = COMPONENT_DATA_TYPES.button;

export const ButtonInspector = ({
  name,
  data,
  onUpdateData,
}: BaseComponentInspectorProps) => {
  const buttonData = useMemo(() => {
    return data.button;
  }, [data]);

  const config: BaseInspectorSectionProps[] = useMemo(() => {
    return [
      {
        title: 'Basic',
        fields: [
          {
            field: 'text',
            label: 'Text',
            value: buttonData?.text,
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
            value: buttonData?.disabled,
            data: {
              text: {
                type: DATA_TYPES.disabled,
              },
            },
          },
          {
            field: 'loading',
            label: 'Loading',
            value: buttonData?.loading,
            data: {
              text: {
                type: DATA_TYPES.loading,
              },
            },
          },
        ],
      },
    ];
  }, [buttonData]);

  return (
    <BaseInspector
      name={name}
      config={config}
      onUpdateData={onUpdateData}
      testId="button-inspector"
    />
  );
};
