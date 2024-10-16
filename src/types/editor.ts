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

export enum ActionViewType {
  General = 'general',
  ResponseHandler = 'responseHandler',
}

export type FieldType = 'string' | 'boolean' | 'number' | 'array' | 'object' | 'any' | 'nested';

export type BaseCanvasComponentProps = {
  name: string;
  eventHandlerCallbacks: Record<string, (e: Event) => void>;
};

export type BaseComponentInspectorProps<T extends ComponentType = any> = {
  name: string;
  data: Component['data'][T];
  eventHandlers: EventHandler<ComponentEvent>[];
  onDataChange: (update: RecursivePartial<Component['data'][T]>) => void;
  onEventHandlersChange: (eventHandlers: EventHandler<ComponentEvent>[]) => void;
};

export type BaseEventHandlerEditorProps<T extends EventHandlerType> = {
  name: string;
  data: EventHandler['data'][T];
  onDataChange: (update: RecursivePartial<EventHandler['data'][T]>) => void;
  isAutosaved?: boolean;
};

export type BaseActionEditorProps<T extends ActionType> = {
  type: ActionType;
  data: Action['data'][T];
  onDataChange: (update: RecursivePartial<Action['data'][T]>) => void;
};
