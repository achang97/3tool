import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { BaseComponentInspectorProps, ComponentType } from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

export const ButtonInspector = ({
  name,
  data,
  onUpdate,
}: BaseComponentInspectorProps) => {
  const { evalData } = useComponentEvalData<ComponentType.Button>(name);

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
                evalResult: evalData.text,
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
                evalResult: evalData.disabled,
              },
            },
          },
          {
            field: 'loading',
            label: 'Loading',
            value: buttonData?.loading,
            data: {
              text: {
                evalResult: evalData.loading,
              },
            },
          },
        ],
      },
    ];
  }, [evalData, buttonData]);

  return (
    <BaseInspector
      type={ComponentType.Button}
      name={name}
      config={config}
      onUpdate={onUpdate}
      testId="button-inspector"
    />
  );
};
