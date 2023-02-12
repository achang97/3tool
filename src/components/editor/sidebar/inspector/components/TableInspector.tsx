import { useComponentEvalData } from '@app/components/editor/hooks/useComponentEvalData';
import { BaseComponentInspectorProps, ComponentType } from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

export const TableInspector = ({
  name,
  data,
  onUpdate,
}: BaseComponentInspectorProps) => {
  const { evalData } = useComponentEvalData<ComponentType.Table>(name);

  const tableData = useMemo(() => {
    return data[ComponentType.Table];
  }, [data]);

  const config: BaseInspectorSectionProps[] = useMemo(() => {
    return [
      {
        title: 'Data',
        fields: [
          {
            field: 'data',
            label: 'Data',
            value: tableData?.data,
            data: {
              text: {
                evalResult: evalData.data,
              },
            },
          },
          {
            field: 'emptyMessage',
            label: 'Empty message',
            value: tableData?.emptyMessage,
            data: {
              text: {
                evalResult: evalData.emptyMessage,
              },
            },
          },
        ],
      },
      {
        title: 'Row selection',
        fields: [
          {
            field: 'multiselect',
            label: 'Enable multi-row selection',
            value: tableData?.multiselect,
            data: {
              text: {
                evalResult: evalData.multiselect,
              },
            },
          },
        ],
      },
    ];
  }, [evalData, tableData]);

  return (
    <BaseInspector
      type={ComponentType.Table}
      name={name}
      config={config}
      onUpdate={onUpdate}
      testId="table-inspector"
    />
  );
};
