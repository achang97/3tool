import { ACTION_METHOD_CONFIGS } from '@app/constants';
import {
  ActionMethod,
  BaseEventHandlerEditorProps,
  EventHandler,
  EventHandlerType,
} from '@app/types';
import { useMemo } from 'react';
import { useToolElementNames } from '../hooks/useToolElementNames';
import {
  BaseInspector,
  BaseInspectorSectionProps,
} from '../sidebar/inspector/components/BaseInspector';

export const EventHandlerActionEditor = ({
  name,
  data,
  onDataChange,
  isAutosaved,
}: BaseEventHandlerEditorProps<EventHandlerType.Action>) => {
  const { actionNames } = useToolElementNames();

  const config: BaseInspectorSectionProps<EventHandler['data']['action']>[] = useMemo(() => {
    return [
      {
        fields: [
          {
            field: 'actionName',
            label: 'Action',
            value: data?.actionName,
            data: {
              select: {
                options: actionNames.map((actionName) => ({
                  label: actionName,
                  value: actionName,
                })),
                placeholder: actionNames.length === 0 ? 'No created actions' : 'Select action',
                disabled: actionNames.length === 0,
              },
            },
          },
          {
            field: 'method',
            label: 'Method',
            value: data?.method,
            data: {
              select: {
                options: Object.values(ActionMethod).map((method) => ({
                  label: ACTION_METHOD_CONFIGS[method].label,
                  value: method,
                })),
                placeholder: 'Select method',
              },
            },
          },
        ],
      },
    ];
  }, [actionNames, data]);

  return (
    <BaseInspector
      name={name}
      config={config}
      onChange={onDataChange}
      isAutosaved={isAutosaved}
      testId="event-handler-action-editor"
    />
  );
};
