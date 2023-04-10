import { ComponentEvent, EventHandler } from '@app/types';
import _ from 'lodash';
import { useCallback, useMemo } from 'react';
import { useEventHandlerExecute } from './useEventHandlerExecute';

const EVENT_MAP: Record<ComponentEvent, string> = {
  [ComponentEvent.Click]: 'onClick',
  [ComponentEvent.Submit]: 'onKeyDown',
};

export const useComponentEventHandlerCallbacks = (
  eventHandlers: EventHandler<ComponentEvent>[]
) => {
  const executeEventHandler = useEventHandlerExecute();

  const shouldExecuteEvent = useCallback((e: Event, componentEvent: ComponentEvent) => {
    switch (componentEvent) {
      case ComponentEvent.Submit: {
        return (e as KeyboardEvent).key === 'Enter';
      }
      default:
        return true;
    }
  }, []);

  const eventHandlerCallbacks = useMemo(() => {
    const callbacks = _.chain(eventHandlers)
      .groupBy('event')
      .mapValues((eventHandlerGroup, event: ComponentEvent) => {
        return (e: Event) => {
          if (!shouldExecuteEvent(e, event)) {
            return;
          }
          eventHandlerGroup.forEach((eventHandler) => executeEventHandler(eventHandler));
        };
      })
      .mapKeys((_eventHandlerGroup, event) => EVENT_MAP[event as ComponentEvent])
      .value();

    return callbacks as unknown as Record<string, (e: Event) => void>;
  }, [eventHandlers, executeEventHandler, shouldExecuteEvent]);

  return eventHandlerCallbacks;
};
