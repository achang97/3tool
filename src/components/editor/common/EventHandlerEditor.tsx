import {
  EVENT_HANDLER_EVENT_CONFIGS,
  EVENT_HANDLER_CONFIGS,
  EVENT_HANDLER_DATA_TEMPLATES,
} from '@app/constants';
import {
  ActionEvent,
  BaseEventHandlerEditorProps,
  ComponentEvent,
  EventHandler,
  EventHandlerType,
} from '@app/types';
import { Box } from '@mui/material';
import { FC, useCallback, useMemo } from 'react';
import {
  BaseInspector,
  BaseInspectorSectionProps,
} from '../sidebar/inspector/components/BaseInspector';
import { EventHandlerActionEditor } from './EventHandlerActionEditor';
import { EventHandlerUrlEditor } from './EventHandlerUrlEditor';

type EventHandlerEditorProps = {
  name: string;
  eventOptions: (ActionEvent | ComponentEvent)[];
  eventHandler: EventHandler;
  onChange: (update: RecursivePartial<EventHandler>) => void;
};

export const EVENT_HANDLER_EDITOR_WIDTH = 265;

const EVENT_HANDLER_EFFECT_CONFIGURATION_MAP: {
  [KeyType in EventHandlerType]: FC<BaseEventHandlerEditorProps<KeyType>>;
} = {
  [EventHandlerType.Action]: EventHandlerActionEditor,
  [EventHandlerType.Url]: EventHandlerUrlEditor,
};

export const EventHandlerEditor = ({
  name,
  eventOptions,
  eventHandler,
  onChange,
}: EventHandlerEditorProps) => {
  const handleChange = useCallback(
    (update: RecursivePartial<EventHandler<ComponentEvent>>) => {
      if (update.type) {
        // NOTE: This update callback merges updates recursively, so any data from previous types
        // will still be persisted in the data object (which can be unideal).
        update.data = {
          [update.type]: EVENT_HANDLER_DATA_TEMPLATES[update.type],
        };
      }

      onChange(update);
    },
    [onChange]
  );

  const handleDataChange = useCallback(
    (update: RecursivePartial<ValueOf<EventHandler['data']>>) => {
      onChange({ data: { [eventHandler.type]: update } });
    },
    [eventHandler.type, onChange]
  );

  const effectEditor = useMemo(() => {
    const TypedEffectConfiguration =
      EVENT_HANDLER_EFFECT_CONFIGURATION_MAP[eventHandler.type];

    if (!TypedEffectConfiguration) {
      return null;
    }

    return (
      <TypedEffectConfiguration
        name={name}
        // @ts-ignore We know that this accesses the correct data key
        data={eventHandler.data[eventHandler.type]}
        onChangeData={handleDataChange}
      />
    );
  }, [eventHandler, handleDataChange, name]);

  const config: BaseInspectorSectionProps[] = useMemo(() => {
    return [
      {
        fields: [
          {
            field: 'event',
            label: 'Event',
            value: eventHandler.event,
            data: {
              select: {
                options: eventOptions.map((eventOption) => ({
                  label: EVENT_HANDLER_EVENT_CONFIGS[eventOption].label,
                  value: eventOption,
                })),
                placeholder: 'Select event',
              },
            },
          },
          {
            field: 'type',
            label: 'Effect',
            value: eventHandler.type,
            data: {
              select: {
                options: Object.values(EventHandlerType).map(
                  (eventHandlerType) => ({
                    label: EVENT_HANDLER_CONFIGS[eventHandlerType].label,
                    value: eventHandlerType,
                  })
                ),
                placeholder: 'Select effect',
              },
            },
          },
          {
            field: 'effect',
            component: effectEditor,
          },
        ],
      },
    ];
  }, [effectEditor, eventHandler, eventOptions]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        padding: 1,
        width: EVENT_HANDLER_EDITOR_WIDTH,
        gap: 1,
      }}
      data-testid="event-handler-editor"
    >
      <BaseInspector name={name} config={config} onChange={handleChange} />
    </Box>
  );
};
