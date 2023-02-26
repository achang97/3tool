import { EventHandler, EventHandlerType, FieldType } from '@app/types';

type EventHandlerDataType<T extends EventHandlerType> = {
  [KeyType in keyof NonNullable<EventHandler['data'][T]>]: FieldType;
};
type EventHandlerDataTypes = {
  [KeyType in EventHandlerType]: EventHandlerDataType<KeyType>;
};

const ACTION_DATA_TYPES: EventHandlerDataType<EventHandlerType.Action> = {
  actionId: 'string',
};

const URL_DATA_TYPES: EventHandlerDataType<EventHandlerType.Url> = {
  url: 'string',
};

export const EVENT_HANDLER_DATA_TYPES: EventHandlerDataTypes = {
  [EventHandlerType.Action]: ACTION_DATA_TYPES,
  [EventHandlerType.Url]: URL_DATA_TYPES,
};
