import { ComponentEvent, EventHandlerType } from '@app/types';

type EventHandlerConfig = {
  label: string;
};

export const EVENT_HANDLER_CONFIGS: Record<
  EventHandlerType,
  EventHandlerConfig
> = {
  [EventHandlerType.Action]: {
    label: 'Control Action',
  },
  [EventHandlerType.Url]: {
    label: 'Go to URL',
  },
};

export const EVENT_HANDLER_COMPONENT_EVENT_CONFIGS: Record<
  ComponentEvent,
  EventHandlerConfig
> = {
  [ComponentEvent.Click]: {
    label: 'Click',
  },
  [ComponentEvent.Submit]: {
    label: 'Submit',
  },
};
