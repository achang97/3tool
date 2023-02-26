import { COMPONENT_DATA_TYPES } from '@app/constants';
import { BaseComponentInspectorProps } from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

const DATA_TYPES = COMPONENT_DATA_TYPES.table;

export const TableInspector = ({
  name,
  data,
  onUpdateData,
}: BaseComponentInspectorProps) => {
  const tableData = useMemo(() => {
    return data.table;
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
                type: DATA_TYPES.data,
              },
            },
          },
          {
            field: 'emptyMessage',
            label: 'Empty message',
            value: tableData?.emptyMessage,
            data: {
              text: {
                type: DATA_TYPES.emptyMessage,
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
                type: DATA_TYPES.multiselect,
              },
            },
          },
        ],
      },
    ];
  }, [tableData]);

  return (
    <BaseInspector
      name={name}
      config={config}
      onUpdateData={onUpdateData}
      testId="table-inspector"
    />
  );
};
