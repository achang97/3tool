import { EventHandler, EventHandlerType } from '@app/types';

type EventHandlerDataJavascriptFlags<T extends EventHandlerType> = {
  [KeyType in keyof NonNullable<EventHandler['data'][T]>]: boolean;
};
type EventHandlerDataJavascriptFlagsMap = {
  [KeyType in EventHandlerType]: EventHandlerDataJavascriptFlags<KeyType>;
};

const ACTION_DATA_JAVASCRIPT_FLAGS: EventHandlerDataJavascriptFlags<EventHandlerType.Action> = {
  // NOTE: This field technically isn't JavaScript, but treating it as JS allows us to
  // easily replace it when the action name changes.
  actionName: true,
  method: false,
};

const URL_DATA_JAVASCRIPT_FLAGS: EventHandlerDataJavascriptFlags<EventHandlerType.Url> = {
  url: false,
  newTab: false,
};

export const EVENT_HANDLER_DATA_JAVASCRIPT_FLAGS: EventHandlerDataJavascriptFlagsMap = {
  [EventHandlerType.Action]: ACTION_DATA_JAVASCRIPT_FLAGS,
  [EventHandlerType.Url]: URL_DATA_JAVASCRIPT_FLAGS,
};
