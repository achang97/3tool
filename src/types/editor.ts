import {
  Action,
  ActionType,
  Component,
  ComponentEvent,
  ComponentType,
  EventHandler,
  EventHandlerType,
} from './api';

export enum SidebarViewType {
  Inspector = 'inspector',
  Components = 'components',
}

export type FieldType =
  | 'string'
  | 'boolean'
  | 'number'
  | 'array'
  | 'object'
  | 'any'
  | 'nested';

export type BaseCanvasComponentProps = {
  name: string;
  eventHandlerCallbacks: Record<string, (e: Event) => void>;
};

export type BaseComponentInspectorProps<T extends ComponentType = any> = {
  name: string;
  data: Component['data'][T];
  eventHandlers: EventHandler<ComponentEvent>[];
  onChangeData: (update: RecursivePartial<Component['data'][T]>) => void;
  onChangeEventHandlers: (
    eventHandlers: EventHandler<ComponentEvent>[]
  ) => void;
};

export type BaseEventHandlerEditorProps<T extends EventHandlerType> = {
  name: string;
  data: EventHandler['data'][T];
  onChangeData: (update: RecursivePartial<EventHandler['data'][T]>) => void;
};

export type BaseActionEditorProps<T extends ActionType> = {
  data: Action['data'][T];
  onChangeData: (update: RecursivePartial<Action['data'][T]>) => void;
};
