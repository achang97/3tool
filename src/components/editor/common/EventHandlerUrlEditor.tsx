import { EVENT_HANDLER_DATA_TYPES } from '@app/constants';
import {
  BaseEventHandlerEditorProps,
  EventHandler,
  EventHandlerType,
} from '@app/types';
import { useMemo } from 'react';
import {
  BaseInspector,
  BaseInspectorSectionProps,
} from '../sidebar/inspector/components/BaseInspector';

const DATA_TYPES = EVENT_HANDLER_DATA_TYPES.url;

export const EventHandlerUrlEditor = ({
  name,
  data,
  onChangeData,
}: BaseEventHandlerEditorProps<EventHandlerType.Url>) => {
  const config: BaseInspectorSectionProps<EventHandler['data']['url']>[] =
    useMemo(() => {
      return [
        {
          fields: [
            {
              field: 'url',
              label: 'URL',
              value: data?.url,
              data: {
                text: {
                  type: DATA_TYPES.url,
                  placeholder: 'Add URL',
                },
              },
            },
            {
              field: 'newTab',
              label: 'New Tab',
              value: data?.newTab,
              data: {
                switch: {},
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
      testId="event-handler-url-editor"
    />
  );
};
