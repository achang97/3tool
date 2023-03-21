import { ActionEvent, ComponentEvent, EventHandlerType } from '@app/types';

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

export const EVENT_HANDLER_EVENT_CONFIGS: Record<
  ActionEvent | ComponentEvent,
  EventHandlerConfig
> = {
  [ActionEvent.Success]: {
    label: 'Success',
  },
  [ActionEvent.Error]: {
    label: 'Error',
  },
  [ComponentEvent.Click]: {
    label: 'Click',
  },
  [ComponentEvent.Submit]: {
    label: 'Submit',
  },
};
