import { EventHandler, EventHandlerType } from '@app/types';

type EventHandlerDataTemplates = {
  [KeyType in EventHandlerType]: NonNullable<EventHandler['data'][KeyType]>;
};

export const EVENT_HANDLER_DATA_TEMPLATES: EventHandlerDataTemplates = {
  [EventHandlerType.Action]: {
    actionId: '',
  },
  [EventHandlerType.Url]: {
    url: '',
  },
};
