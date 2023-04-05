import { COMPONENT_DATA_TYPES } from '@app/constants';
import {
  BaseComponentInspectorProps,
  Component,
  ComponentType,
} from '@app/types';
import { useMemo } from 'react';
import { BaseInspector, BaseInspectorSectionProps } from './BaseInspector';

const DATA_TYPES = COMPONENT_DATA_TYPES.table;

export const TableInspector = ({
  name,
  data,
  onDataChange,
}: BaseComponentInspectorProps<ComponentType.Table>) => {
  const config: BaseInspectorSectionProps<Component['data']['table']>[] =
    useMemo(() => {
      return [
        {
          title: 'Data',
          fields: [
            {
              field: 'data',
              label: 'Data',
              value: data?.data,
              data: {
                text: {
                  type: DATA_TYPES.data,
                },
              },
            },
            {
              field: 'emptyMessage',
              label: 'Empty message',
              value: data?.emptyMessage,
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
              value: data?.multiselect,
              data: {
                text: {
                  type: DATA_TYPES.multiselect,
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
      onChange={onDataChange}
      isAutosaved
      testId="table-inspector"
    />
  );
};
